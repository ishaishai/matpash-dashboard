module.exports = action => {
  switch (action.type) {
    case 'login':
      console.log(action.data);
      break;

    case 'graph_creation':
      console.log(action.data);
      break;

    case 'graph_deletion':
      console.log(action.data);
      break;

    default:
      break;
  }
};
