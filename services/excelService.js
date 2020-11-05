const { spawn } = require('child_process');

class ExcelService {
  runExcelCheck(path, filename) {
    console.log('excel service:', path, filename)
    return new Promise((resolve, reject) => {
      const python = spawn('python', ['excelCheck.py', path, filename]);
      let error;
      let result;

      python.stdout.on('data', data => {
        result = data.toString();
      });

      python.stderr.on('data', data => {
        error = data.toString();
      });

      python.stdout.on('end', () => {
        if (error) {
          reject(error)
        }
        resolve(result);
      });
    });
  }
}

module.exports = ExcelService;
