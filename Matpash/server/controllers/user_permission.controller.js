const xlsx = require("xlsx");
const db = require("../conf/dbconf")
const usersdbpool = db.usersdbpool;

//const qr =  'SELECT * FROM (select "id","username" from public."usersInfoTable") as tmp JOIN public."usersPriviledgesTable" using("id");';

exports.getPermission = async(req, res)=>{
    usersdbpool.query('SELECT * FROM (select "id","username" from public."usersInfoTable") as tmp JOIN public."usersPriviledgesTable" using("id") order by id desc;')
    .then(result =>{
        
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

async function updateSingleUserPermissions(updateValuesArray)
{
    try {
        const res = await usersdbpool.query('UPDATE public."usersPriviledgesTable" set  "admin"=$2, "view"=$3, "edit"=$4,  "print"=$5,  "pdf"=$6, "image"=$7,  "csv"=$8,  "xlsx"=$9,  "dataTable"=$10 where id=$1;',updateValuesArray);
        return true;
    } catch(e){
        return false;
    }
};

exports.updatePermissions = async(req, res)=>{

    console.log('********updatePermissions***********', req.body);
    const userToUpdate = req.body ;
    let updateValuesArray = null;
    let updatesResults = {};
    let isUpdateSuccess = false;
    for(var i=0; i < userToUpdate.length ; i++) {
        updateValuesArray = [userToUpdate[i]['id'], userToUpdate[i]['view'],userToUpdate[i]['admin'],userToUpdate[i]['edit'], userToUpdate[i]['print'],userToUpdate[i]['pdf'], userToUpdate[i]['image'], userToUpdate[i]['csv'],userToUpdate[i]['xlsx'],userToUpdate[i]['dataTable']];
        isUpdateSuccess = await updateSingleUserPermissions(updateValuesArray);
        updatesResults[userToUpdate[i]['id']] = isUpdateSuccess;
    }
    res.status(200).json({
        msg: 'ok',
        updatesResults: updatesResults
    });

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