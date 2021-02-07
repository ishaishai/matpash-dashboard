exports.hebDate = () => {
  let today = new Date();
  let days = new Array();
  days['Sun'] = 'יום ראשון';
  days['Mon'] = 'יום שני';
  days['Tue'] = 'יום שלישי';
  days['Wed'] = 'יום רביעי';
  days['Thu'] = 'יום חמישי';
  days['Fri'] = 'יום שישי';
  days['Sat'] = 'יום שבת';

  let months = new Array();
  months['Jan'] = 'ינואר';
  months['Feb'] = 'פברואר';
  months['Mar'] = 'מרץ';
  months['Apr'] = 'אפריל';
  months['May'] = 'מאי';
  months['Jun'] = 'יוני';
  months['Jul'] = 'יולי';
  months['Aug'] = 'אוגוסט';
  months['Sep'] = 'ספטמבר';
  months['Oct'] = 'אוקטובר';
  months['Nov'] = 'נובמבר';
  months['Dec'] = 'דצמבר';

  return `${
    days[today.toDateString().split(' ')[0]]
  } בשעה ${today
    .toLocaleTimeString()
    .slice(
      0,
      today.toLocaleTimeString().lastIndexOf(':'),
    )} - ${today.getDate()} ל${
    months[today.toDateString().split(' ')[1]]
  }, ${today.getFullYear()}.`;
};
