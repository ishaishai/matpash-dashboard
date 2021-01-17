const {
  dashboarddbpool,
  maindbpool,
  usersdbpool,
} = require('../../../../config/dbConfig');

exports.catagoryBuilder = async graph => {
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
  return graph.flipXAxis
    ? tempxAxisCatagoryRange.reverse()
    : tempxAxisCatagoryRange;
};
