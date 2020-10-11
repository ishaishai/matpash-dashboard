const xlsx = require('xlsx');
const { maindbpool } = require('../db');

exports.getTablesName = async (req, res) => {
  console.log('AFAF');
  let tbList;
  maindbpool
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' and table_name not like '%KV%' ",
    )
    .then(result => {
      tbList = result.rows.map(t => t.table_name);
      res.status(200).json({
        tableList: tbList,
      });
    })
    .catch(err => {
      res.status(404).json({
        error: err.message,
      });
    });
  // console.log(tbList);
};

exports.getColFromTable = async (req, res) => {
  let table_name = req.params.table_name;
  table_name = `${table_name} - KV`;

  maindbpool
    .query(`SELECT * FROM "${table_name}" `)
    .then(result => {
      res.status(200).json({
        colNamesList: result.rows[0],
      });
    })
    .catch(err => {
      res.status(404).json({
        error: err.message,
      });
    });
};

exports.getPeriodStart = async (req, res) => {
  console.log(req.params);
  const tableName = req.params.table_name;
  const userId = '123456789'; //should get from token.
  console.log('+' + tableName + '+');
  const firstColumnData = `select "A1" from public."${tableName}"`;
  const firstColumnName = `select "A1" from public."${tableName} - KV"`;

  try {
    let resData = await maindbpool.query(firstColumnData);

    let resName = await maindbpool.query(firstColumnName);
    res.status(200).json({
      column: {
        columnIndex: 'A1',
        columnName: resName.rows[0],
        columnData: resData.rows,
      },
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};

exports.getPeriodEnd = async (req, res) => {
  const tableName = req.params.table_name;
  const periodStart = req.params.start;

  const userId = '123456789'; //should get from token.
  console.log(periodStart);
  try {
    let periodStartEnumerated = `select "rownum" from (select "A1",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp
    where "A1" like '%${periodStart}%';`;

    let resEnumrate = await maindbpool.query(periodStartEnumerated);


    //getting all values that after the start 
    let resRange = await maindbpool.query(`select "A1" from (select "A1",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
    rownum >=${resEnumrate.rows[0].rownum}`);

    const firstColumnName = `select "A1" from public."${tableName} - KV"`;
    let resName = await maindbpool.query(firstColumnName);

    res.status(200).json({
      column: {
        columnIndex: 'A1',
        columnName: resName.rows[0],
        columnData: resRange.rows,
      },
    });
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
    console.log(err);
  }
};
