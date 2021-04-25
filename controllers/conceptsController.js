const conceptsService = require('../services/conceptsService');

exports.getAllConcepts = async (req, res) => {
  if (req.user.permissions != 'מנהל') {
    res.status(500).json({ msg: 'המשתמש אינו מורשה לדף זה' });
  }
  try {
    const data = await conceptsService.getAllConcepts();
    console.log(data);
    res.status(200).json({ concepts: data });
  } catch (error) {
    res.status(500).json({ msg: 'לא ניתן למשוך נתונים' });
  }
};

exports.addConcept = async (req, res) => {
  try {
    const response = await conceptsService.saveConcept(req.body.concept);
    res.status(200).json({ msg: 'OK' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'המושג קיים במילון' });
  }
};

exports.deleteConcept = async (req, res) => {
  try {
    console.log(req.body);
    const response = await conceptsService.deleteConcept(req.body.title);
    res.status(200).json({ msg: 'OK' });
  } catch (error) {
    res.status(500).json({ msg: 'הפעולה נכשלה' });
  }
};
