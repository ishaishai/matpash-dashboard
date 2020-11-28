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
      const { path, originalname } = req.file;
      console.log("BAB");
      const data = await excelService.runExcelCheck(path, originalname);
      console.log("caac");
      return res.send(data);
    } catch (error) {
      return res.status(500).json({ error });
    }
  });
};

exports.saveExcel = async (req, res) => {
  const { fileName } = req.body;
  try {
    let workBook = xlsx.readFile(`Exceloutput/${fileName}`);

    let ans = await xlsxParser.parseExcelWorkBook(workBook);
    if (ans === 1) {
      res.status(200).send('OK');
    }
  } catch (error) {
    console.error(error.message);
  }
};
