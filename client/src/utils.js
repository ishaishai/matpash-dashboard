export const validateFile = fileName => {
  return /\.(xlsx|xls|xlsm)$/i.test(fileName);
};
