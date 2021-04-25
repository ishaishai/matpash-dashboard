const db = require('../config/dbConfig');
const { dashboarddbpool, maindbpool, usersdbpool } = db;
const storeOperation = require('../services/storeOperation');

exports.getAllConcepts = async () => {
  return new Promise(async (resolve, reject) => {
    dashboarddbpool
      .query(`select * from public."conceptsDictionary"`)
      .then(response => {
        resolve(response.rows);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

exports.saveConcept = async concept => {
  return new Promise(async (resolve, reject) => {
    dashboarddbpool
      .query(
        `INSERT INTO public."conceptsDictionary"(
        title, definition)
        VALUES ('${concept.title}', '${concept.definition}')`,
      )
      .then(response => {
        resolve(true);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};

exports.deleteConcept = async title => {
  return new Promise(async (resolve, reject) => {
    dashboarddbpool
      .query(
        `DELETE FROM public."conceptsDictionary"
          WHERE "title"='${title}'`,
      )
      .then(response => {
        resolve(true);
      })
      .catch(error => {
        reject(error.message);
      });
  });
};
