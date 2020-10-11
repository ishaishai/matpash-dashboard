const xlsx = require('xlsx');
const xlsxParser = require('../func/excelParser');
const upload = require('../middlewares/fileUpload');
const ExcelService = require('../services/excelService');

const excelService = new ExcelService();

exports.checkExcel = async (req, res) => {
  upload(req, res, async err => {
    if (err) {
      return res.status(400).send('File upload error');
    }
    try {
      const { path } = req.file;
      const data = await excelService.runExcelCheck(path);
      return res.send(data);
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
};

exports.upload = async (req, res) => {
  try {
    let xlsxFile = req.files.file;
    await xlsxFile.mv('tmpFiles/' + xlsxFile.name);
    let workBook = xlsx.readFile('tmpFiles/' + xlsxFile.name);

    let ans = await xlsxParser.parseExcelWorkBook(workBook);
    if (ans == 1) {
      res.status(200).send({ response: 'OK' });
    }
  } catch (error) {
    console.error(error.message);
  }
};