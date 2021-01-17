//line,columns,area,bar share the same one
const db = require('../../../../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;

exports.basicSerieBuilder = async (graph, dashId) => {
  let graphSeries = [];
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

  //get all the series of dashboard and extract from it which series to the right graph by its index
  const queryDashSeries = `select * from public."dashboard${dashId}Series" where "dashboard${dashId}Series"."index" = ${graph.index}`;
  result = await dashboarddbpool.query(queryDashSeries);
  let seriesList = result.rows;

  for (series of seriesList) {
    let lineSeriesToAdd = {
      name: null,
      color: null,
      data: [],
    };

    const tableName = series.serieName.split('.')[0];
    const columnName = series.serieName.split('.')[1];
    let columnNameResult = await maindbpool.query(
      `select "${columnName}" from public."${tableName} - KV"`,
    );

    lineSeriesToAdd.name = Object.values(columnNameResult.rows[0])[0];
    lineSeriesToAdd.color = series.color;

    //for each serie needed to pull its data so serieName needed to be split by dot and then be used like
    //maybe not use range for series because all data in range of xAxis is enough
    let querySerie;

    querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
                    rownum >=${fromNum} and rownum<=${toNum}`;

    result = await maindbpool.query(querySerie);
    //if (graphToAdd.type == 'line')

    let lineTempDataToAdd = [];
    for (obj of result.rows) {
      lineTempDataToAdd.push(
        Object.values(obj)[0] % 1 === 0
          ? parseInt(Object.values(obj)[0])
          : parseFloat(Object.values(obj)[0]),
      );
    }
    lineSeriesToAdd.data = lineTempDataToAdd;
    if (graph.flipXAxis) lineSeriesToAdd.data = lineSeriesToAdd.data.reverse();
    graphSeries.push(lineSeriesToAdd);
  }
  return graphSeries;
};
