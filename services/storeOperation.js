const db = require('../db');

module.exports = async operation => {
  switch (operation.type) {
    case 'login':
      await store(operation.username, 'התחברות למערכת');
      return;

    case 'graph_creation':
      console.log(action.data);
      return;

    case 'graph_deletion':
      console.log(action.data);
      return;

    default:
      return;
  }
};

async function store(username, operation) {
  await db.query(
    `INSERT INTO "eventsTable" 
      ("username", "operation", "date")
      VALUES ($1, $2, $3)`,
    [username, operation, new Date().toLocaleString()]
  );
}
