const db = require('../../../../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;

exports.xAxisTitlePull = async graph => {
  try {
    let [xAxisTable, xAxisColumn] = graph.xAxisColumn.split('.');
    let xAxisTitleResult = await maindbpool.query(
      `select "${xAxisColumn}" from public."${xAxisTable} - KV"`,
    );
    console.log(xAxisTitleResult.rows);
    return xAxisTitleResult.rows[0][`${xAxisColumn}`];
  } catch (error) {
    return error;
  }
};
