exports.numberWithCommas = num => {
  if (num) {
    console.log(num);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};
