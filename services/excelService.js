const { spawn } = require('child_process');

class ExcelService {
  runExcelCheck(path) {
    return new Promise((resolve, reject) => {
      const python = spawn('python', ['excelCheck.py', path]);
      let error;
      let dataToSend;

      python.stdout.on('data', data => {
        dataToSend = data.toString();
      });

      python.stderr.on('data', data => {
        error = data.toString();
      });

      python.stdout.on('end', () => {
        if (error) {
          reject(error)
        }
        resolve(dataToSend);
      });
    });
  }
}

module.exports = ExcelService;
