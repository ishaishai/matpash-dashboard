const UserService = require('../services/userService');
const db = require('../config/dbConfig');
const { usersdbpool } = db;

const userService = new UserService();

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await userService.getPermissions();
    res.status(200).json({ permissions });
  } catch (error) {
    res.status(500).json({ error });
  }
};



exports.getall = async(req, res)=>{
  console.log('exports.getall');
  usersdbpool.query(`SELECT * from public."usersInfoTable" where "id" != '000000000'`)//usersInfoTable
  .then(result =>{
      //console.log(result);
       
      //tbList = result.rows.map( t=> t.table_name)
      res.status(200).json({
          msg: 'ok',
          users: result.rows
      })
  }).catch(err =>{
      res.status(404).json({
          error: err
      })
  })
}


exports.search = async(req, res)=>{
  console.log('exports.search');
  console.log('page:', req.params.page);
  console.log('str: ',req.query);
  const str = req.query.str.toLowerCase();
  const search_phrase = "%"+str+"%";

  
  let countRes = await usersdbpool.query(`SELECT count(*) from public."usersInfoTable" where lower(username) like '${search_phrase}' and "id"!='000000000' ;`)
  const totalCount = countRes.rows.length;

  const perPage = 15;
  const offset = perPage *  (  parseInt(req.params.page) - 1 ) ;
  const pageCount = Math.ceil(totalCount/perPage);
  usersdbpool.query(`SELECT * from public."usersInfoTable" where lower(username) like '${search_phrase}' and "id"!='000000000' limit ${perPage} offset ${offset} ;`)
  .then(result =>{
      res.status(200).json({
          msg: 'search',
          users: result.rows,
          totalCount:totalCount,
          perPage: perPage,
          pageCount:pageCount
      })
  }).catch(err =>{
      res.status(404).json({
          error: err
      })
  })
}

exports.page = async(req, res)=>{
  console.log('exports.page');
  console.log('userid:', req.params.page);

  let countRes = await usersdbpool.query('SELECT count(*) from public."usersInfoTable" ;')
  const totalCount = countRes.rows[0].count;

  const perPage = 3;
  const offset = perPage *  (  parseInt(req.params.page) - 1 ) ;
  const pageCount = Math.ceil(parseInt(totalCount)/parseInt(perPage));

  usersdbpool.query('SELECT * from public."usersInfoTable" limit $1 offset $2 ;', [perPage, offset])//usersInfoTable
  .then(result =>{
      res.status(200).json({
          msg: 'ok',
          users: result.rows,
          totalCount:totalCount,
          perPage: perPage,
          pageCount:pageCount
      })
  }).catch(err =>{
      res.status(404).json({
          error: err
      })
  })
}

exports.userinfo = async(req, res)=>{
  console.log('exports.userinfo');
  console.log('userid:', req.params.userid);
  usersdbpool.query('SELECT * from public."usersInfoTable" where id=$1;',[req.params.userid])
  .then(result =>{
      res.status(200).json({
          msg: 'ok',
          userinfo: result.rows
      })
  }).catch(err =>{
      res.status(404).json({
          error: err
      })
  })

}