const xlsx = require("xlsx");
const db = require("../conf/dbconf")
const usersdbpool = db.usersdbpool;


exports.getViewPermission = async(req, res)=>{
    console.log('exports.getall');
    usersdbpool.query('SELECT * from public."eventsTable";')
    .then(result =>{
        console.log(result);
        
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

exports.userinfo = async(req, res)=>{
    console.log('exports.userinfo');
    console.log('userid:', req.params.userid);
    usersdbpool.query('SELECT * from public."usersInfoTable" where id=$1;',[req.params.userid])
    .then(result =>{
        //console.log(result);
        //tbList = result.rows.map( t=> t.table_name)
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