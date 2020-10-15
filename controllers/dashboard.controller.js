const db = require('../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;

exports.getDashboardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; //** here need to get user id from token.
  const dashboardToReturn = {
    id: id,
    graphList: [],
  };

  console.log(id);

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;
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

    for (graph of graphList) {
      const graphToAdd = { index: graph.index };
      graphToAdd.options = {
        chart: {
          zoomType: null,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: graph.type,
        },
        title: {
          text: graph.title,
        },
        subtitle: {
          text: graph.subtitle,
        },
        tooltip: {
          headerFormat:
            graph.type == 'pie'
              ? `<span dir = "rtl" style="font-size:10px">{point.key}<table></span>`
              : '',
          pointFormat:
            graph.type == 'pie'
              ? '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>'
              : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        xAxis: {
          title: {
            text: graph.xAxisTitle,
          },
          type: null,
          catagories: [],
          crosshair: true,
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          verticalAlign: 'middle',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              distance: 0,
              enabled: false,
            },
            startAngle: 0,
            endAngle: 0,
            center: ['50%', '50%'],
            showInLegend: true,
            size: '110%',
          },
        },
        responsive: {
          rules: [
            {
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                },
              },
            },
          ],
        },
        layout: {
          xPos: graph.xPos,
          yPos: graph.yPos,
          height: graph.height,
          width: graph.width,
        },
        series: [],
        sum: 0,
      };

      let [table, col] = graph.xAxisColumn.split('.');

      result = await maindbpool.query(
        `select "${col}" from public."${table} - KV"`,
      );

      xAxisColumn = result.rows[0][col];
      const xAxisColumnName = graph.xAxisColumn.split('.')[1];
      const xAxisTableName = graph.xAxisColumn.split('.')[0];
      const fromStr = graph.xAxisCatagoryRange.split('$')[0];
      const toStr = graph.xAxisCatagoryRange.split('$')[1];

      //extract enumerated value of rows for the wanted range

      let queryGetEnumeratedValues;
      if (!toStr) {
        queryGetEnumeratedValues = `select "rownum" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
                where "${xAxisColumnName}" like '%${fromStr}%';`;
      } else {
        queryGetEnumeratedValues = `select rownum from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
                where "${xAxisColumnName}" like '%${fromStr}%' or "${xAxisColumnName}" like '%${toStr}%'`;
      }
      if (graphToAdd.options.chart.type == 'pie')
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
      result = await maindbpool.query(queryGetXAxisCatagory);

      let tempxAxisCatagoryRange = [];
      for (obj of result.rows) {
        tempxAxisCatagoryRange.push(Object.values(obj)[0]);
      }

      //graphToAdd.xAxisCatagoryRange = tempxAxisCatagoryRange;
      graphToAdd.options.xAxis.catagories = tempxAxisCatagoryRange;
      //console.log("---------- xAxisCatagoryRange: "+graphToAdd.xAxisCatagoryRange);

      //get all the series of dashboard and extract from it which series to the right graph by its index
      const queryDashSeries = `select * from public."dashboard${id}Series" where "dashboard${id}Series"."index" = ${graph.index}`;
      result = await dashboarddbpool.query(queryDashSeries);
      let seriesList = result.rows;

      let pieTempDataToAdd = [];

      let pieSeriesToAdd = {
        name: null,
        colr: null,
        data: [],
      };

      for (series of seriesList) {
        let lineSeriesToAdd = {
          name: null,
          colr: null,
          data: [],
        };
        let lineTempDataToAdd = [];
        let pieColorsArray = [];

        const tableName = series.serieName.split('.')[0];
        const columnName = series.serieName.split('.')[1];
        let columnNameResult = await maindbpool.query(
          `select "${columnName}" from public."${tableName} - KV"`,
        );

        if (
          graphToAdd.options.chart.type == 'pie' ||
          graphToAdd.options.chart.type == 'halfpie'
        ) {
          pieSeriesToAdd.name = Object.values(columnNameResult.rows[0])[0];
          //pieSeriesToAdd.colr = series.color;
          pieColorsArray.push(series.color);
        } else {
          lineSeriesToAdd.name = Object.values(columnNameResult.rows[0])[0];
          lineSeriesToAdd.colr = series.color;
        }

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
        result = await maindbpool.query(querySerie);
        if (
          graphToAdd.options.chart.type == 'pie' ||
          graphToAdd.options.chart.type == 'halfpie'
        ) {
          for (obj of result.rows) {
            graphToAdd.options.sum += Object.values(obj).map(Number)[0];
          }

          let colorArrayIndex = 0;
          for (obj of result.rows) {
            // console.log(
            //   parseFloat(Object.values(obj)[0] / graphToAdd.options.sum),
            // );
            pieTempDataToAdd.push({
              selected: false,
              sliced: false,
              name: pieSeriesToAdd.name,
              y: parseInt(Object.values(obj)[0]),
              color: pieColorsArray[colorArrayIndex++],
              //parseFloat(Object.values(obj)[0] / graphToAdd.options.sum) * 100, //change this
            });
          }
        } //if (graphToAdd.type == 'line')
        else {
          for (obj of result.rows) {
            lineTempDataToAdd.push(parseInt(Object.values(obj)[0]));
          }
          lineSeriesToAdd.data = lineTempDataToAdd;
        }

        if (
          graphToAdd.options.chart.type != 'pie' &&
          graphToAdd.options.chart.type != 'halfpie'
        ) {
          graphToAdd.options.series.push(lineSeriesToAdd);
        }
      }

      // if (
      //   graphToAdd.options.chart.type != 'pie' &&
      //   graphToAdd.options.chart.type != 'halfpie'
      // ) {
      //   graphToAdd.options.sum = 1;
      // }
      if (
        graphToAdd.options.chart.type == 'pie' ||
        graphToAdd.options.chart.type == 'halfpie'
      ) {
        //calculate each part of series in them:
        for (let serie of pieTempDataToAdd) {
          let tmpSerieY = serie.y;
          serie.y = parseFloat(tmpSerieY / graphToAdd.options.sum) * 100;
        }

        pieSeriesToAdd.data = pieTempDataToAdd;
        graphToAdd.options.series.push(pieSeriesToAdd);
        //graphToAdd.options.plotOptions.pie.dataLabels.enabled = true;
        if (graphToAdd.options.chart.type == 'halfpie') {
          graphToAdd.options.chart.type = 'pie';
          graphToAdd.options.plotOptions.pie.dataLabels.distance = -50;
          graphToAdd.options.plotOptions.pie.style = {
            fontWeight: 'bold',
            color: 'white',
          };
          graphToAdd.options.plotOptions.pie.startAngle = -90;
          graphToAdd.options.plotOptions.pie.endAngle = 90;
          graphToAdd.options.plotOptions.pie.center = ['50%', '75%'];
          graphToAdd.options.plotOptions.pie.size = '110%';
          graphToAdd.options.series.innerSize = '50%';
        }
      }
      // if (graphToAdd.options.chart.type == 'pie') {
      //   for (let serie of graphToAdd.options.series) {
      //     console.log(serie);
      //   }
      // }
      dashboardToReturn.graphList.push(graphToAdd);
    }

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
  const userId = req.user.id; //should get from token.
  console.log('user id:');
  console.log(req.user);
  try {
    //this will get you a number. if there are 2 dashboards then 2. build strings like 'Dash 1' 'Dash 2'.
    const result = await dashboarddbpool.query(
      `select * from public."dashboardPriviledgesTable" where "userId"='${userId}'`,
    ); //complete query.
    console.log(result.rows[0]);
    let nameList = Object.entries(result.rows[0])
      .filter(([key, value]) => {
        if (key !== 'userId' && value != null && page == 'tabs') {
          console.log(key);
          return true;
        } else if (key !== 'userId' && value != null && page == 'create') {
          console.log(key);
          return true;
        } else if (key !== 'userId' && req.user.permissions == 'מנהל') {
          console.log(key);
          return true;
        } else return false;
      })
      .map(name => name[0].substring(9));
    res.status(200).json({
      dashboardIdList: nameList,
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

  try {
    //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
    const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;

    let result = await dashboarddbpool.query(queryPullDashboard); //complete query.

    if (result.rows.length === 0)
      throw new Error('user has no permisson to dashboard');

    let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

    graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');

    //use the string of the numbers from orevious -> '1,2,3' and delete them from graphsInfoTable
    const queryDeleteGraphs = `DELETE FROM public."graphsInfoTable" WHERE "index" in (${graphsExtracted})`;

    await dashboarddbpool.query(queryDeleteGraphs); //complete query.

    await dashboarddbpool.query(
      `ALTER TABLE public."dashboardPriviledgesTable" DROP COLUMN "dashboard${id}";`,
    );
    // await dashboarddbpool.query(
    //   `update public."dashboardPriviledgesTable" set dashboard${id} = '';`,
    // ); //complete query.

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

  const userId = req.user.id; //should get from token.

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
        `graph '${graph_id}' is not part of dashboard${dashboard_id}`,
      );

    graphsExtracted = graphsExtracted.map(num => `${num}`).join(',');

    //console.log(graphsExtracted)

    //just create new string without the wanted graph and use the following update to erase existence
    await dashboarddbpool.query(
      `update public."dashboardPriviledgesTable" set dashboard${dashboard_id} = '${graphsExtracted}'WHERE "userId" in (select "userId" from public."dashboardPriviledgesTable" where "dashboard${dashboard_id}" is NOT NULL);`,
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
  const userId = req.user.id; //should get from token.

  try {
    //first get the next dashboard id.
    let result = await dashboarddbpool.query(`SELECT count(*) as index FROM information_schema.columns
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
  // //each object in layoutObjectList is {layoutObject}
  try {
    for (let layout of layoutObjectList) {
      ///iterate through the layoutObjectList and update each graph with the new layout
      result = await dashboarddbpool.query(`UPDATE public."graphsInfoTable"
          SET width=${layout.w}, height=${layout.h}, "xPos"=${layout.x}, "yPos"=${layout.y} 
          WHERE "graphsInfoTable"."index" = ${layout.i};`); //complete query.
    }

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
  const { dashboardId, graph } = req.body;

  const userId = req.user.id; //should get from token.
  try {
    //get all graphs in current dashboard '1,2,3'

    const queryInsertGraph = `INSERT INTO public."graphsInfoTable"(
      "index", "position", "width", "height", "xPos", "yPos", "layoutIndex", "type", "title", "subtitle", "xAxisTitle", "yAxisTitle", "xAxisColumn", "yAxisColumn",
      "xAxisCatagoryRange", "yAxisCatagoryRange", "legend")
      VALUES ((SELECT COALESCE(MAX(index),0)+1 from public."graphsInfoTable"), '0', 3, 
            3, 0,0, 1, '${graph.type}','${graph.title}',
            '${graph.subtitle}', '${graph.xAxisTitle}', '', '${graph.xAxisColumn}', 
            '', '${graph.xAxisCatagoryRange}', '', true);
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

    //get all editor and root users
    result = await usersdbpool.query(
      `select "usersPriviledgesTable"."id" from "public"."usersPriviledgesTable" where "admin"=true;`,
    );

    let usersId = result.rows.map(idObj => `'${idObj.id}'`);

    usersId = usersId.join(',');

    result = await dashboarddbpool.query(
      `select "dashboard${dashboardId}" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" in (${usersId})`,
    );

    let newGraphList = result.rows[0][`dashboard${dashboardId}`];
    let queryInsertGraphToDashboard;

    if (newGraphList == null) {
      newGraphList = index;
      queryInsertGraphToDashboard = `UPDATE public."dashboardPriviledgesTable"
        SET "dashboard${dashboardId}"='${newGraphList}'
        WHERE "userId" in (select "userId" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" in (${usersId}))`;
    } else {
      newGraphList += `,${index}`;
      queryInsertGraphToDashboard = `UPDATE public."dashboardPriviledgesTable"
        SET "dashboard${dashboardId}"='${newGraphList}'
        WHERE "userId" in (select "userId" from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."dashboard${dashboardId}" is not null)`;
    }

    //console.log(newGraphList)

    //use the graph string and update each user that has access to that dashboard
    dashboarddbpool.query(queryInsertGraphToDashboard);

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
