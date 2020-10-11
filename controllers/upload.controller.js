const xlsx = require('xlsx');
const xlsxParser = require('../func/excelParser');
const iconv  = require('iconv-lite');

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
