const db = require('../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;

exports.getDashboardById = async (req, res) => {
  const { id } = req.params;

  // const userId = '305101560'; //** here need to get user id from token.
  const userId = '123456789';

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;
    let result = await dashboarddbpool.query(queryPullDashboard); //complete query.

    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

    graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');

    //extract the string of the numbers from '1,2,3' to `'1','2','3'` and use the following
    const queryPullGraphs = `select * from public."graphsInfoTable" where "graphsInfoTable"."index" in (${graphsExtracted})`;

    result = await dashboarddbpool.query(queryPullGraphs);

    const graphList = result.rows;

    const dashboardToReturn = {
      id: id,
      graphList: [],
    };

    for (graph of graphList) {
      const graphToAdd = {};

      graphToAdd.index = graph.index;
      graphToAdd.type = graph.type;
      graphToAdd.title = graph.title;
      graphToAdd.subtitle = graph.subtitle;
      graphToAdd.xAxisTitle = graph.xAxisTitle;
      graphToAdd.yAxisTitle = graph.yAxisTitle;
      graphToAdd.xAxisColumn = graph.xAxisColumn;
      graphToAdd.yAxisColumn = graph.yAxisColumn;
      graphToAdd.xAxisCatagoryRange = [];
      graphToAdd.legend = graph.legend;
      graphToAdd.series = [];

      graphToAdd.layout = {
        position: graph.position,
        width: graph.width,
        height: graph.height,
        xPos: graph.xPos,
        yPos: graph.yPos,
        layoutIndex: graph.layoutIndex,
      };

      const xAxisColumnName = graph.xAxisColumn.split('.')[1];
      const xAxisTableName = graph.xAxisColumn.split('.')[0];
      const fromStr = graph.xAxisCatagoryRange.split('-')[0];
      const toStr = graph.xAxisCatagoryRange.split('-')[1];

      //extract enumerated value of rows for the wanted range
      let queryGetEnumeratedValues;
      if (!toStr) {
        console.log('111111');
        queryGetEnumeratedValues = `select "rownum" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
                where "${xAxisColumnName}" like '%${fromStr}%';`;
      } else {
        queryGetEnumeratedValues = `select rownum from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
                where "${xAxisColumnName}" like '%${fromStr}%' or "${xAxisColumnName}" like '%${toStr}%'`;
      }

      console.log('AAAAAAAAAAAAAAAAAAAAAAA');
      console.log(queryGetEnumeratedValues);

      result = await maindbpool.query(queryGetEnumeratedValues);
      const fromNum = result.rows[0].rownum;
      const toNum = !result.rows[1] ? undefined : result.rows[1].rownum;

      //from previous statement we get two values for the enumerated range lets say 2 and 8. now we want all real values between them.
      let queryGetXAxisCatagory;
      if (!toNum) {
        queryGetXAxisCatagory = `select "${xAxisColumnName}" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp where
                rownum >=${fromNum}`;
      } else {
        queryGetXAxisCatagory = `select "${xAxisColumnName}" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp where
                rownum >=${fromNum} and rownum<=${toNum}`;
      }
      console.log(queryGetXAxisCatagory);
      result = await maindbpool.query(queryGetXAxisCatagory);

      graphToAdd.xAxisCatagoryRange = result.rows.map(
        obj => Object.values(obj)[0]
      );

      //get all the series of dashboard and extract from it which series to the right graph by its index
      const queryDashSeries = `select * from public."dashboard${id}Series"`;

      result = await dashboarddbpool.query(queryDashSeries);

      const seriesList = result.rows;

      for (series of seriesList) {
        const tableName = series.serieName.split('.')[0];
        const columnName = series.serieName.split('.')[1];

        const seriesToAdd = {
          name: series.serieName, //maybe cahnge this to name
          colr: series.color,
          data: [],
        };

        //for each serie needed to pull its data so serieName needed to be split by dot and then be used like
        //maybe not use range for series because all data in range of xAxis is enough
        let querySerie;
        if (!toNum) {
          querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
                    rownum =${fromNum}`;
        } else {
          querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
                    rownum >=${fromNum} and rownum<=${toNum}`;
        }

        console.log(querySerie);
        result = await maindbpool.query(querySerie);

        const dataToAdd = result.rows.map(obj => Object.values(obj)[0]);

        seriesToAdd.data = dataToAdd;

        graphToAdd.series.push(seriesToAdd);
      }

      dashboardToReturn.graphList.push(graphToAdd);
    }

    console.log(dashboardToReturn);

    res.status(200).json({
      msg: 'ok',
      dashboard: dashboardToReturn,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.getDashboardNames = async (req, res) => {
  try {
    //this will get you a number. if there are 2 dashboards then 2. build strings like 'Dash 1' 'Dash 2'.
    const result = await dashboarddbpool.query(`SELECT max(ordinal_position)-1 as dashcount FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name   = 'dashboardPriviledgesTable';`); //complete query.
    let dashcount = result.rows[0].dashcount;
    console.log(result);
    res.status(200).json({
      msg: 'ok',
      dashboardCount: dashcount, //here result.dashboard
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.deleteDashboardById = async (req, res) => {
  const { id } = req.params;

  const userId = '123'; //should get from token.

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;

    let result = await dashboarddbpool.query(queryPullDashboard); //complete query.

    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

    graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');

    console.log(graphsExtracted);

    //use the string of the numbers from orevious -> '1,2,3' and delete them from graphsInfoTable
    const queryDeleteGraphs = `DELETE FROM public."graphsInfoTable" WHERE "index" in (${graphsExtracted})`;

    await dashboarddbpool.query(queryDeleteGraphs); //complete query.

    await dashboarddbpool.query(
      `update public."dashboardPriviledgesTable" set dashboard${id} = '';`
    ); //complete query.

    const queryDeleteDashSeriesTable = `DROP TABLE public."dashboard${id}Series";`;

    await dashboarddbpool.query(queryDeleteDashSeriesTable); //complete query.

    res.status(200).json({
      msg: 'dashboard deleted!',
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.deleteGraphFromDashboard = async (req, res) => {
  const { dashboard_id, graph_id } = req.params;

  const userId = '123'; //should get from token.

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${dashboard_id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;

    const result = await dashboarddbpool.query(queryPullDashboard); //complete query.

    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${dashboard_id}`].split(',');

    const index = graphsExtracted.indexOf(graph_id);
    if (index > -1) {
      graphsExtracted.splice(index, 1);
    } else
      throw new Error(
        `graph '${graph_id}' is not part of dashboard${dashboard_id}`
      );

    graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');

    console.log(graphsExtracted);

    //just create new string without the wanted graph and use the following update to erase existence
    await dashboarddbpool.query(
      `update public."dashboardPriviledgesTable" set dashboard${id} = '${graphs}';`
    ); //complete query.

    //delete all series data for the target graph
    const queryDeleteGraphSeries = `DELETE FROM public."dashboard${dashboard_id}Series" WHERE "dashboard${dashboard_id}Series"."index"=${graph_id};`;

    await dashboarddbpool.query(queryDeleteGraphSeries); //complete query.

    //now needed to delete graph from graphsInfoTable and all its attributes from dashboard${id}Series
    const queryDeleteGraph = `DELETE FROM public."graphsInfoTable" WHERE "graphsInfoTable"."index"=${graph_id};`;

    await dashboarddbpool.query(queryDeleteGraph); //complete query.

    res.status(200).json({
      msg: 'graph removed from dashbard!',
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.addNewDashboard = async (req, res) => {
  const { dashboardObject } = req.body;

  const userId = '123'; //should get from token.

  try {
    //first get the next dashboard id.
    let result = await dashboarddbpool.query(`SELECT max(ordinal_position)+1 as index FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'dashboardPriviledgesTable';`); //complete query.
    //then use that to create a new dashboard and its series table

    const index = result.rows[0].index;

    result = await dashboarddbpool.query(`ALTER TABLE public."dashboardPriviledgesTable"
        ADD COLUMN "dashboard${index}" text COLLATE pg_catalog."default"`);

    result = dashboarddbpool.query(`CREATE TABLE public."dashboard${index}Series"
        (
            index integer NOT NULL,
            "serieName" text COLLATE pg_catalog."default" NOT NULL,
            "serieRange" text COLLATE pg_catalog."default" NOT NULL,
            color text COLLATE pg_catalog."default" NOT NULL,
            CONSTRAINT fk_index FOREIGN KEY (index)
            REFERENCES public."graphsInfoTable" (index) MATCH SIMPLE
                ON UPDATE CASCADE
                ON DELETE CASCADE
                )`);

    //get all editor and root users
    result = await usersdbpool.query(
      `select "usersPriviledgesTable"."id" from "public"."usersPriviledgesTable" where "admin"=true or "edit"=true;`
    );

    let usersId = result.rows.map(idObj => idObj.id);

    usersId = usersId.join(',');

    //next add all graphs id to the new dashboard column (need you to pull graphs id from the object)
    //where it matches the users id from previous.

    result = await dashboarddbpool.query(`UPDATE public."dashboardPriviledgesTable"
        SET dashboard1=1
        WHERE "userId" in ('${usersId}');`); //usersId is from previous statement "id,id,id,id"

    for (graph of dashboardObject.graphList) {
      //iterate through the dashboardObject (list of graph: {graph,layoutAttributes});
      result = await dashboarddbpool.query(`INSERT INTO public."graphsInfoTable"(
                "index", "position", "width", "height", "xPos", "yPos", "layoutIndex", "type", "title", "subtitle", "xAxisTitle", "yAxisTitle", "xAxisColumn", "yAxisColumn",
                "xAxisCatagoryRange", "yAxisCatagoryRange", "legend")
                VALUES ((select max(index)+1 from public."graphsInfoTable"), '${graph.layout.position}', ${graph.layout.width}, 
                ${graph.layout.height}, ${graph.layout.xPos}, ${graph.layout.yPos}, ${graph.layout.layoutIndex}, '${graph.type}','${graph.title}',
                '${graph.subtitle}', '${graph.xAxisTitle}', '${graph.yAxisTitle}', '${graph.xAxisColumn}', 
                '${graph.yAxisColumn}', '${graph.xAxisCatagoryRange}', '${graph.yAxisCatagoryRange}', ${graph.legend});
            `);

      //next needed to update series for dashboard (for each graph so still in iteration)
      //pull graph series object and then use next statement
      result = await dashboarddbpool.query(`INSERT INTO public."dashboard${index}Series"(
                index, "serieName", "serieRange", color)
                VALUES ((select max(index) from public."graphsInfoTable"), '${graph.series.name}', '${graph.series.range}', '${graph.series.color}');`);
    }

    res.status(200).json({
      msg: 'dashboard added',
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};

exports.addNewGraphToDashboard = async (req, res) => {
  const { dashboardId, graphObject } = req.body;

  try {
    //get all graphs in current dashboard '1,2,3'
    const queryPullDashboard = `select dashboard${dashboardId} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${sessionUserID}'`;

    const queryInsertGraph = `INSERT INTO public."graphsInfoTable"(
            "index", "Position", "Width", "Height", "xPos", "yPos", "layoutIndex", "Type", "Title", "Subtitle", "xAxisTitle", "yAxisTitle", "xAxisColumn", "yAxisColumn",
            "xAxisCatagoryRange", "yAxisCatagoryRange", "Legend")
            VALUES ((select max(index)+1 from public."graphsInfoTable"), '${graph.layout.Position}', ${graph.layout.width}, 
            ${graph.layout.height}, ${graph.layout.xpos}, ${graph.layout.ypos}, ${graph.layout.index}, '${graph.graph.type}','${graph.graph.title}',
            '${graph.graph.subtitle}', '${graph.graph.xAxisTitle}', '${graph.graph.yAxisTitle}', '${graph.graph.xAxisColumn}', 
            '${graph.graph.yAxisColumn}', '${graph.graph.xAxisCatagoryRange}', '${graph.graph.yAxisCatagoryRange}', ${graph.graph.legend});
        `;

    //next needed to update series for dashboard (for each graph so still in iteration)
    //pull graph series object and then use next statement
    const queryInsertGraphSeries = `INSERT INTO public."dashboard${dashboardId}Series"(index, "serieName", "serieRange", color) VALUES ((select max(index) from public."graphsInfoTable"), '${serie.Name}', '${serie.Range}', '${serie.color}');`;
    //get latest graph id and add it to the result of queryPullDashboard 1,2,3,4 ->latest
    const queryGetLatestGraphId = `select max(index) from public."graphsInfoTable"`;

    //use the graph string and update each user that has access to that dashboard
    const queryInsertGraphToDashboard = `UPDATE public."dashboardPriviledgesTable"
        SET dashboard1='1,2'
        WHERE "userId" in (select "userId" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."dashboard1" is not null)`;

    const result = await maindbpool.query(''); //complete query.

    res.status(200).json({
      msg: 'ok',
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};
