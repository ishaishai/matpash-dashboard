const xlsx = require('xlsx');
const { maindbpool } = require('../db');

exports.getTablesName = async (req, res) => {
  console.log('AFAF');
  maindbpool
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' and table_name not like '%KV%' "
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
  console.log(tbList);
};

exports.getColFromTable = async (req, res) => {
  let { table_name } = req.params;
  table_name = `${table_name} - KV`;

  maindbpool
    .query(`SELECT * FROM "${table_name}" `)
    .then(result => {
      cols = Object.values(result.rows[0]);
      res.status(200).json({
        colNamesList: cols,
      });
    })
    .catch(err => {
      res.status(404).json({
        error: err.message,
      });
    });
};
