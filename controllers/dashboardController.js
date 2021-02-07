const db = require('../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;
const storeOperation = require('../services/storeOperation');
const { graphChooser } = require('../services/graphService/graph');
const { graph } = require('../services/graphService/graph');
const { hebDate } = require('../func/hebDate');

exports.getDashboardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; //** here need to get user id from token.
  const username = req.user.username;

  const dashboardToReturn = {
    id: id,
    graphList: [],
  };

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."username" = '${username}'`;

    let result = await dashboarddbpool.query(queryPullDashboard); //complete query.
    if (
      result.rows[0][`dashboard${id}`] === null ||
      result.rows[0] === undefined
    )
      throw new Error('user has no permisson to dashboard');
    else if (result.rows[0][`dashboard${id}`] == '') {
      res.status(200).json({
        msg: 'ok',
        dashboard: dashboardToReturn,
      });
    }
    let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

    let tempGraphsExtracted = [];

    for (num of graphsExtracted) {
      tempGraphsExtracted.push(`'${num}'`);
    }

    graphsExtracted = tempGraphsExtracted.join(',');

    //extract the string of the numbers from '1,2,3' to `'1','2','3'` and use the following
    const queryPullGraphs = `select * from public."graphsInfoTable" where "graphsInfoTable"."index" in (${graphsExtracted})`;

    result = await dashboarddbpool.query(queryPullGraphs);

    const graphList = result.rows;

    for (let graph of graphList) {
      if (graph.type !== undefined) {
        const graphToAdd = await graphChooser(graph, id);
        dashboardToReturn.graphList.push(graphToAdd);
      }
    }

    //console.log(dashboardToReturn);
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
  const page = req.params.page;
  const dashboardNamesKV = [];
  const username = req.user.username;

  const userId = req.user.id;

  try {
    //this will get you a number. if there are 2 dashboards then 2. build strings like 'Dash 1' 'Dash 2'.
    const result = await dashboarddbpool.query(
      `select * from public."dashboardPriviledgesTable" where "username"='${username}'`,
    ); //complete query.
    let nameList = Object.entries(result.rows[0])
      .filter(([key, value]) => {
        if (key !== 'username' && value != null && page == 'tabs') {
          return true;
        } else if (key !== 'username' && value != null && page == 'create') {
          return true;
        }
        //else if (key !== 'userId' && req.user.permissions == 'מנהל') { return true; }
        else return false;
      })
      .map(name => name[0].substring(9));
    for (let name of nameList) {
      const result = await dashboarddbpool.query(
        `select * from public."dashboardNames" where "index"='${name}'`,
      ); //complete query.

      dashboardNamesKV.push(result.rows[0]);
    }
    const resultDefaultDash = await usersdbpool.query(
      `select "defaultDash" from public."usersInfoTable" where "username"='${username}'`,
    );
    res.status(200).json({
      dashboardIdList: dashboardNamesKV,
      defaultDashboard: resultDefaultDash.rows[0].defaultDash,
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.deleteDashboardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; //should get from token.
  const username = req.user.username;

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."username" = '${username}'`;

    let result = await dashboarddbpool.query(queryPullDashboard); //complete query.
    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

    graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');
    //use the string of the numbers from orevious -> '1,2,3' and delete them from graphsInfoTable

    if (graphsExtracted != `''`) {
      const queryDeleteGraphs = `DELETE FROM public."graphsInfoTable" WHERE "index" in (${graphsExtracted})`;

      await dashboarddbpool.query(queryDeleteGraphs); //complete query.
    }

    console.log(
      `ALTER TABLE public."dashboardPriviledgesTable" DROP COLUMN "dashboard${id}";`,
    );
    await dashboarddbpool.query(
      `ALTER TABLE public."dashboardPriviledgesTable" DROP COLUMN "dashboard${id}";`,
    );
    // await dashboarddbpool.query(
    //   `update public."dashboardPriviledgesTable" set dashboard${id} = '';`,
    // ); //complete query.

    const queryDeleteDashSeriesTable = `DROP TABLE public."dashboard${id}Series";`;

    await dashboarddbpool.query(queryDeleteDashSeriesTable); //complete query.

    const queryDeleteDashName = `DELETE FROM public."dashboardNames" where index=${id}`;

    await dashboarddbpool.query(queryDeleteDashName);
    await storeOperation({
      type: 'dashboard_deletion',
      username: req.user.username,
    });

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

  const userId = req.user.id; //should get from token.
  const username = req.user.username;

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${dashboard_id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."username" = '${username}'`;

    const result = await dashboarddbpool.query(queryPullDashboard); //complete query.

    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${dashboard_id}`].split(',');

    const index = graphsExtracted.indexOf(graph_id);
    if (index > -1) {
      graphsExtracted.splice(index, 1);
    } else
      throw new Error(
        `graph '${graph_id}' is not part of dashboard${dashboard_id}`,
      );

    graphsExtracted = graphsExtracted.map(num => `${num}`).join(',');

    //console.log(graphsExtracted)

    //just create new string without the wanted graph and use the following update to erase existence
    await dashboarddbpool.query(
      `update public."dashboardPriviledgesTable" set dashboard${dashboard_id} = '${graphsExtracted}'WHERE "username" in (select "username" from public."dashboardPriviledgesTable" where "dashboard${dashboard_id}" is NOT NULL);`,
    ); //complete query.

    //delete all series data for the target graph
    const queryDeleteGraphSeries = `DELETE FROM public."dashboard${dashboard_id}Series" WHERE "dashboard${dashboard_id}Series"."index"=${graph_id};`;

    await dashboarddbpool.query(queryDeleteGraphSeries); //complete query.

    //now needed to delete graph from graphsInfoTable and all its attributes from dashboard${id}Series
    const queryDeleteGraph = `DELETE FROM public."graphsInfoTable" WHERE "graphsInfoTable"."index"=${graph_id};`;

    await dashboarddbpool.query(queryDeleteGraph); //complete query.

    await storeOperation({
      type: 'graph_deletion',
      username: req.user.username,
    });

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
  const dashboardName = req.body.dashboardName;
  try {
    //first get the next dashboard id.
    let result = await dashboarddbpool.query(`SELECT max("ordinal_position")+1 as index
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name   = 'dashboardPriviledgesTable'
       ;`); //complete query.
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

    result = dashboarddbpool.query(`INSERT INTO public."dashboardNames"(
      index, name,lastUpdate)
      VALUES (${index}, '${dashboardName}','${hebDate()}');`);

    await storeOperation({
      type: 'dashboard_creation',
      username: req.user.username,
    });

    res.status(200).json({
      msg: 'dashboard added',
      dashboardId: index,
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      error: err.message,
    });
  }
};

exports.updateDashboardById = async (req, res) => {
  const layoutObjectList = req.body.layout_grid;
  const dashboardID = req.body.dashboardID;
  // //each object in layoutObjectList is {layoutObject}
  try {
    for (let layout of layoutObjectList) {
      ///iterate through the layoutObjectList and update each graph with the new layout
      result = await dashboarddbpool.query(`UPDATE public."graphsInfoTable"
          SET width=${layout.w}, height=${layout.h}, "xPos"=${layout.x}, "yPos"=${layout.y} 
          WHERE "graphsInfoTable"."index" = ${layout.i};`); //complete query.
    }
    console.log(hebDate());
    dashboarddbpool.query(`UPDATE public."dashboardNames"
    SET lastupdate='${hebDate()}'
    WHERE index='${dashboardID}'`);

    await storeOperation({
      type: 'dashboard_update',
      username: req.user.username,
    });

    res.status(200).json({
      msg: 'ok',
    });
  } catch (err) {
    res.status(404).json({
      error: err,
    });
    console.log(err);
  }
};

exports.addNewGraphToDashboard = async (req, res) => {
  let dashboardId = req.body.dashboardId;
  let regex = new RegExp(/^\d+$/);
  let isIdNum = regex.test(dashboardId);
  const graph = req.body.graph;

  const username = req.user.username;

  try {
    //get all graphs in current dashboard '1,2,3'
    if (!isIdNum) {
      let queryGetDashboardIndex = `select "index" from public."dashboardNames" where name = '${dashboardId}'`;
      let resultIndex = await dashboarddbpool.query(queryGetDashboardIndex);
      if (resultIndex.rows[0]) {
        dashboardId = resultIndex.rows[0].index;
      }
    }
    const queryInsertGraph = `INSERT INTO public."graphsInfoTable"(
      "index", "position", "width", "height", "xPos", "yPos", "layoutIndex", "type", "title", "subtitle", "xAxisTitle", "yAxisTitle", "xAxisColumn", "yAxisColumn",
      "xAxisCatagoryRange", "yAxisCatagoryRange", "legend","flipXAxis","info")
      VALUES ((SELECT COALESCE(MAX(index),0)+1 from public."graphsInfoTable"), '0', 3, 
            3, 0,0, 1, '${graph.type}','${graph.title}',
            '${graph.subtitle}', '${graph.xAxisTitle}', '${graph.yAxisTitle}', '${graph.xAxisColumn}', 
            '', '${graph.xAxisCatagoryRange}', '', true,${graph.flip},'${graph.info}');
        `;

    await dashboarddbpool.query(queryInsertGraph);

    //next needed to update series for dashboard (for each graph so still in iteration)
    //pull graph series object and then use next statement

    for (let serie of graph.series) {
      const queryInsertGraphSeries = `INSERT INTO public."dashboard${dashboardId}Series"(index, "serieName", "serieRange", color) VALUES ((select max(index) from public."graphsInfoTable"), '${serie.serieName}', '', '${serie.color}');`;
      await dashboarddbpool.query(queryInsertGraphSeries);
    }
    //get latest graph id and add it to the result of queryPullDashboard 1,2,3,4 ->latest
    const queryGetLatestGraphId = `select max(index) as index from public."graphsInfoTable"`;

    let result = await dashboarddbpool.query(queryGetLatestGraphId);

    const index = result.rows[0].index;

    //get all  users
    result = await usersdbpool.query(
      `select "username" from "public"."usersInfoTable" where "permissions"='מנהל';`,
    );

    let usersNames = result.rows.map(
      usernameObj => `'${usernameObj.username}'`,
    );

    usersNames = usersNames.join(',');

    result = await dashboarddbpool.query(
      `select "dashboard${dashboardId}" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."username" in (${usersNames})`,
    );

    let newGraphList = result.rows[0][`dashboard${dashboardId}`];
    let queryInsertGraphToDashboard;

    if (newGraphList == null || newGraphList == '') {
      newGraphList = index;
      queryInsertGraphToDashboard = `UPDATE public."dashboardPriviledgesTable"
        SET "dashboard${dashboardId}"='${newGraphList}'
        WHERE "username" in (select "username" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."username" in (${usersNames}))`;
    } else {
      newGraphList += `,${index}`;
      queryInsertGraphToDashboard = `UPDATE public."dashboardPriviledgesTable"
        SET "dashboard${dashboardId}"='${newGraphList}'
        WHERE "username" in (select "username" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."dashboard${dashboardId}" is not null)`;
    }

    //console.log(newGraphList)

    //use the graph string and update each user that has access to that dashboard
    dashboarddbpool.query(queryInsertGraphToDashboard);

    dashboarddbpool.query(`UPDATE public."dashboardNames"
    SET lastupdate='${hebDate()}'
    WHERE index='${dashboardId}'`);
    await storeOperation({
      type: 'graph_creation',
      username: req.user.username,
    });

    res.status(200).json({
      msg: 'graph added!',
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};

exports.setDefaultDashboard = async (req, res) => {
  const dashId = req.params.id;
  const username = req.user.username;

  try {
    usersdbpool.query(`UPDATE public."usersInfoTable"
    SET "defaultDash"='${dashId}'
    WHERE "username"='${username}'`);

    res.status(200).json({
      msg: 'OK',
    });
  } catch (error) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};

exports.addNewGolden = async (req, res) => {
  let goldenData = req.body.goldenData;
  console.log(goldenData);
  if (goldenData !== undefined) {
    let resultIndex = await dashboarddbpool.query(
      `SELECT COALESCE(MAX(index),0)+1 as "index" from public."goldenDataTable"`,
    );
    let layoutResult = await dashboarddbpool.query(`INSERT INTO public."goldenLayoutTable"(
        index, title,valuetype, width, height, "xPos", "yPos")
        VALUES (${resultIndex.rows[0].index},'${goldenData.title}','${
      goldenData.valueType
    }', ${goldenData.data.length + 1}, 1.75,0, 0);`);
    for (let serie of goldenData.data) {
      let result = await dashboarddbpool.query(`INSERT INTO public."goldenDataTable"(
          index, "subTitle", seriename, period, cmpPeriod)
          VALUES (${resultIndex.rows[0].index}, '${serie.subTitle}', '${serie.serieName}',
                      '${serie.period}','${serie.cmpPeriod}')`);
    }

    res.status(200).json({
      msg: 'OK',
    });
  } else {
    res.state(400).json({
      msg: 'FAIL',
    });
  }
};

exports.updateGraphInfo = async (req, res) => {
  const { graph } = req.body;
  try {
    let resultUpdate = await dashboarddbpool.query(
      `UPDATE public."graphsInfoTable"
    SET info='${graph.info}'
    WHERE index='${graph.index}'`,
    );

    //get dashboardId in the request and then
    // dashboarddbpool.query(`UPDATE public."dashboardNames"
    // SET lastupdate='${hebDate()}'
    // WHERE index='${dashboardId}'`);

    if (resultUpdate)
      res.status(200).json({
        msg: 'ok',
      });
  } catch (e) {
    res.status(500).json({
      msg: 'failed',
    });
  }
};

exports.getGoldens = async (req, res) => {
  let resultGoldens = await dashboarddbpool.query(
    `select * from public."goldenDataTable"`,
  );
  let goldensDict = {};

  for (let golden of resultGoldens.rows) {
    if (goldensDict[golden.index] === undefined) {
      goldensDict[golden.index] = { goldens: [], layout: undefined };
    }

    let selectedTable = golden.seriename.split('.')[0];
    let selectedColumn = golden.seriename.split('.')[1];

    const dataPeriodQuery = await maindbpool.query(`select "A1","${selectedColumn}" from public."${selectedTable}" 
    where
     "A1" = '${golden.period}'`);

    const dataCmpPeriodQuery = await maindbpool.query(`select "A1","${selectedColumn}" from public."${selectedTable}" 
    where
     "A1" = '${golden.cmpperiod}'`);

    goldensDict[golden.index].goldens.push({
      subTitle: golden.subTitle,
      periodValue: parseFloat(dataPeriodQuery.rows[0][selectedColumn]),
      periodCmpValue: parseFloat(dataCmpPeriodQuery.rows[0][selectedColumn]),
    });
    console.log(goldensDict[golden.index].goldens);
  }

  for (let gold in goldensDict) {
    for (let golden of goldensDict[gold].goldens) {
      console.log(golden);
    }
  }

  let resultLayouts = await dashboarddbpool.query(
    `select * from public."goldenLayoutTable"`,
  );

  for (let layout of resultLayouts.rows) {
    goldensDict[layout.index].layout = layout;
  }

  let goldensList = [];
  for (let key in goldensDict) {
    goldensList.push(goldensDict[key]);
  }

  console.log(goldensList);

  res.status(200).json({
    goldensList: goldensList,
  });
};
