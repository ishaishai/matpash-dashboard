const db = require('../../../../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;

exports.pieSerieBuilder = async (graph, dashId) => {
  let [table, col] = graph.xAxisColumn.split('.');

  result = await maindbpool.query(
    `select "${col}" from public."${table} - KV"`,
  );
  xAxisColumn = result.rows[0][col];
  const xAxisColumnName = graph.xAxisColumn.split('.')[1];
  const xAxisTableName = graph.xAxisColumn.split('.')[0];
  const fromStr = graph.xAxisCatagoryRange.split('$')[0];
  const toStr = graph.xAxisCatagoryRange.split('$')[1];
  let sum = 0;
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
  const queryDashSeries = `select * from public."dashboard${dashId}Series" where "dashboard${dashId}Series"."index" = ${graph.index}`;
  result = await dashboarddbpool.query(queryDashSeries);
  let seriesList = result.rows;

  let pieTempDataToAdd = [];

  let pieSeriesToAdd = {
    name: null,
    color: null,
    data: [],
    innerSize: '40%',
  };

  for (series of seriesList) {
    console.log(series, 'seriesinpiebuilder');
    let pieColorsArray = [];

    const tableName = series.serieName.split('.')[0];
    const columnName = series.serieName.split('.')[1];
    let columnNameResult = await maindbpool.query(
      `select "${columnName}" from public."${tableName} - KV"`,
    );

    pieSeriesToAdd.name = Object.values(columnNameResult.rows[0])[0];
    //pieSeriesToAdd.colr = series.color;
    pieColorsArray.push(series.color);

    //for each serie needed to pull its data so serieName needed to be split by dot and then be used like
    //maybe not use range for series because all data in range of xAxis is enough
    let querySerie;
    querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
                    rownum =${fromNum}`;

    console.log(querySerie);
    result = await maindbpool.query(querySerie);

    for (obj of result.rows) {
      sum += Object.values(obj).map(Number)[0];
    }

    let colorArrayIndex = 0;
    for (obj of result.rows) {
      console.log(obj);
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
  }
  //calculate each part of series in them:
  for (let serie of pieTempDataToAdd) {
    serie.y = parseFloat(serie.actualValue / sum) * 100;
  }

  pieSeriesToAdd.data = pieTempDataToAdd;
  console.log(pieSeriesToAdd);
  return [pieSeriesToAdd];

  // if (graphToAdd.options.chart.type == 'pie') {

  //   for (let serie of graphToAdd.options.series) {
  //     console.log(serie);
  //   }
  // }

  //   let graphSeries = [];
  //   let [table, col] = graph.xAxisColumn.split('.');
  //   let sum = 0;
  //   result = await maindbpool.query(
  //     `select "${col}" from public."${table} - KV"`,
  //   );

  //   xAxisColumn = result.rows[0][col];
  //   const xAxisColumnName = graph.xAxisColumn.split('.')[1];
  //   const xAxisTableName = graph.xAxisColumn.split('.')[0];
  //   const fromStr = graph.xAxisCatagoryRange.split('$')[0];
  //   const toStr = graph.xAxisCatagoryRange.split('$')[1];

  //   //extract enumerated value of rows for the wanted range

  //   let queryGetEnumeratedValues;
  //   if (!toStr) {
  //     queryGetEnumeratedValues = `select "rownum" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
  //                 where "${xAxisColumnName}" like '%${fromStr}%';`;
  //   } else {
  //     queryGetEnumeratedValues = `select rownum from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
  //                 where "${xAxisColumnName}" like '%${fromStr}%' or "${xAxisColumnName}" like '%${toStr}%'`;
  //   }

  //   result = await maindbpool.query(queryGetEnumeratedValues);

  //   const fromNum = result.rows[0].rownum;
  //   const toNum = !result.rows[1] ? undefined : result.rows[1].rownum;
  //   //from previous statement we get two values for the enumerated range lets say 2 and 8. now we want all real values between them.
  //   let queryGetXAxisCatagory;
  //   if (!toNum) {
  //     queryGetXAxisCatagory = `select "${xAxisColumnName}" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp where
  //                 rownum >=${fromNum}`;
  //   } else {
  //     queryGetXAxisCatagory = `select "${xAxisColumnName}" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp where
  //                 rownum >=${fromNum} and rownum<=${toNum}`;
  //   }
  //   result = await maindbpool.query(queryGetXAxisCatagory);

  //   let tempxAxisCatagoryRange = [];
  //   for (obj of result.rows) {
  //     tempxAxisCatagoryRange.push(Object.values(obj)[0]);
  //   }

  //   //get all the series of dashboard and extract from it which series to the right graph by its index
  //   const queryDashSeries = `select * from public."dashboard${dashId}Series" where "dashboard${dashId}Series"."index" = ${graph.index}`;
  //   result = await dashboarddbpool.query(queryDashSeries);
  //   let seriesList = result.rows;

  //   let pieTempDataToAdd = [];

  //   let pieSeriesToAdd = {
  //     type: 'pie',
  //     colorByPoint: true,
  //     data: [],
  //   };

  //   for (series of seriesList) {
  //     let pieColorsArray = [];

  //     const tableName = series.serieName.split('.')[0];
  //     const columnName = series.serieName.split('.')[1];
  //     let columnNameResult = await maindbpool.query(
  //       `select "${columnName}" from public."${tableName} - KV"`,
  //     );

  //     pieColorsArray.push(series.color);
  //     let querySerie;
  //     querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
  //                   rownum =${fromNum}`;
  //     result = await maindbpool.query(querySerie);
  //     for (obj of result.rows) {
  //       sum += Object.values(obj).map(Number)[0];
  //     }

  //     let colorArrayIndex = 0;
  //     for (obj of result.rows) {
  //       pieTempDataToAdd.push({
  //         selected: false,
  //         sliced: false,
  //         name: Object.values(columnNameResult.rows[0])[0],
  //         y: 0,
  //         actualValue: parseInt(Object.values(obj)[0]),
  //         color: pieColorsArray[colorArrayIndex++],
  //         //parseFloat(Object.values(obj)[0] / graphToAdd.options.sum) * 100, //change this
  //       });
  //     }
  //   }
  //   for (let serie of pieTempDataToAdd) {
  //     serie.y = parseFloat(serie.actualValue / sum) * 100;
  //   }
  //   pieSeriesToAdd.data = pieTempDataToAdd;

  //   console.log(pieSeriesToAdd);
  //   let data = {
  //     series: pieSeriesToAdd,
  //     sum: sum,
  //   };
  //   return data;
};
