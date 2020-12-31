const db = require('../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;
const storeOperation = require('../services/storeOperation');

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
    console.log(result.rows[0][`dashboard${id}`]);
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
          style: {
            textAlign: 'right',
            fontSize: '16px',
          },
          headerFormat:
            graph.type == 'pie' ? `<span dir="rtl">{point.key}` : '',
          pointFormat:
            graph.type == 'pie'
              ? '<div style="padding:0"><b>{point.y:.3f}%</b></div>' +
                '<div style="padding:0">ערך מספרי: <b>{point.actualValue}</b></div>'
              : '<div dir="rtl" style="color:{series.color};padding:0";>{series.name}: </div>' +
                '<div dir="rtl" style="padding:0"><b dir="ltr" style="display: inline-block;">{point.y:.3f} </b></div>',

          footerFormat: '</span>',
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
        yAxis: {
          title: {
            text: graph.yAxisTitle,
          },
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          useHTML: true,
          title: {
            text: null, //'<b> מקרא </b>',//'<div className = "highcharts-label highcharts-legend-title">:מקרא</div>'
          },
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
      graphToAdd.options.xAxis.catagories = graph.flipXAxis
        ? tempxAxisCatagoryRange.reverse()
        : tempxAxisCatagoryRange;
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
              y: 0,
              actualValue: parseInt(Object.values(obj)[0]),
              color: pieColorsArray[colorArrayIndex++],
              //parseFloat(Object.values(obj)[0] / graphToAdd.options.sum) * 100, //change this
            });
          }
        } //if (graphToAdd.type == 'line')
        else {
          for (obj of result.rows) {
            lineTempDataToAdd.push(
              Object.values(obj)[0] % 1 === 0
                ? parseInt(Object.values(obj)[0])
                : parseFloat(Object.values(obj)[0]),
            );
          }
          lineSeriesToAdd.data = lineTempDataToAdd;
          if (graph.flipXAxis)
            lineSeriesToAdd.data = lineSeriesToAdd.data.reverse();
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
          serie.y =
            parseFloat(serie.actualValue / graphToAdd.options.sum) * 100;
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
    console.log(dashboardNamesKV);
    const resultDefaultDash = await usersdbpool.query(
      `select "defaultDash" from public."usersInfoTable" where "username"='${username}'`,
    );
    console.log(resultDefaultDash);
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
    console.log(id);
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
      index, name)
      VALUES (${index}, '${dashboardName}');`);

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
  // //each object in layoutObjectList is {layoutObject}
  try {
    for (let layout of layoutObjectList) {
      ///iterate through the layoutObjectList and update each graph with the new layout
      result = await dashboarddbpool.query(`UPDATE public."graphsInfoTable"
          SET width=${layout.w}, height=${layout.h}, "xPos"=${layout.x}, "yPos"=${layout.y} 
          WHERE "graphsInfoTable"."index" = ${layout.i};`); //complete query.
    }

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
  console.log(dashboardId, graph);

  const username = req.user.username;

  try {
    //get all graphs in current dashboard '1,2,3'
    console.log(isIdNum);
    if (!isIdNum) {
      let queryGetDashboardIndex = `select "index" from public."dashboardNames" where name = '${dashboardId}'`;
      let resultIndex = await dashboarddbpool.query(queryGetDashboardIndex);
      console.log(resultIndex.rows[0].index, 'resultIndex');
      if (resultIndex.rows[0]) {
        dashboardId = resultIndex.rows[0].index;
      }
    }
    const queryInsertGraph = `INSERT INTO public."graphsInfoTable"(
      "index", "position", "width", "height", "xPos", "yPos", "layoutIndex", "type", "title", "subtitle", "xAxisTitle", "yAxisTitle", "xAxisColumn", "yAxisColumn",
      "xAxisCatagoryRange", "yAxisCatagoryRange", "legend","flipXAxis")
      VALUES ((SELECT COALESCE(MAX(index),0)+1 from public."graphsInfoTable"), '0', 3, 
            3, 0,0, 1, '${graph.type}','${graph.title}',
            '${graph.subtitle}', '${graph.xAxisTitle}', '${graph.yAxisTitle}', '${graph.xAxisColumn}', 
            '', '${graph.xAxisCatagoryRange}', '', true,${graph.flip});
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

    let dataPeriodQuery = await maindbpool.query(`select "A1","${selectedColumn}" from public."${selectedTable}" 
    where
     "A1" = '${golden.period}'`);

    let dataCmpPeriodQuery = await maindbpool.query(`select "A1","${selectedColumn}" from public."${selectedTable}" 
    where
     "A1" = '${golden.cmpperiod}'`);

    goldensDict[golden.index].goldens.push({
      subTitle: golden.subTitle,
      periodValue: parseFloat(dataPeriodQuery.rows[0][selectedColumn]).toFixed(
        2,
      ),
      periodCmpValue: parseFloat(
        dataCmpPeriodQuery.rows[0][selectedColumn],
      ).toFixed(2),
    });
    //goldensDict[golden.index].goldens.push(golden);
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
