const { usersQuery } = require('../db');

module.exports = async operation => {
  switch (operation.type) {
    case 'login':
      await store(operation.username, 'התחברות למערכת');
      return;

    case 'register':
      await store(operation.username, 'יצירת משתמש חדש');
      return;

    case 'graph_creation':
      await store(operation.username, 'יצירת גרף');
      return;

    case 'graph_deletion':
      await store(operation.username, 'מחיקת גרף');
      return;

    case 'dashboard_creation':
      await store(operation.username, 'יצירת דשבורד');
      return;

    case 'dashboard_update':
      await store(operation.username, 'עדכון דשבורד');
      return;

    case 'dashboard_deletion':
      await store(operation.username, 'מחיקת דשבורד');
      return;

    default:
      return;
  }
};

async function store(username, operation) {
  await usersQuery(
    `INSERT INTO public."eventsTable" 
      ("username", "operation", "date")
      VALUES ($1, $2, $3)`,
    [username, operation, new Date().toLocaleString()]
  );
}
