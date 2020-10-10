const xlsx = require('xlsx');
const xlsxParser = require('../func/excelParser');
const upload = require('../middlewares/fileUpload');
const TableService = require('../services/tablesService');

const tablesService = new TableService();

exports.upload = async (req, res) => {
  upload(req, res, async err => {
    if (err) {
      return res.status(400).send('File upload error');
    }
    try {
      const { path } = req.file;
      const data = await tablesService.runExcelCheck(path);
      return res.send(data);
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
};
