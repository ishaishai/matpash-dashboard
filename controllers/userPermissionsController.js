const xlsx = require("xlsx");
const db = require('../config/dbConfig');
const { usersdbpool } = db;

//const qr =  'SELECT * FROM (select "id","username" from public."usersInfoTable") as tmp JOIN public."usersPriviledgesTable" using("id");';

const getUserGraphPermissions = async (req,res) => {
    console.log(req.user.id);
    try { 
            result = await usersdbpool.query(`select "print","pdf","image" from public."usersPriviledgesTable" where "id" = '${req.user.id}'`);
            console.log("in get user graph permissions");
            console.log(result.rows[0]);
                //tbList = result.rows.map( t=> t.table_name)
            res.status(200).json({
                msg: 'ok',
                userPriviledges: result.rows[0],
            });
        } catch(err) {
            res.status(404).json({
                error: err
            })
        }
}

const getAllPermissions = async (req,res) => {
    usersdbpool.query(`select * from (select "id","username","permissions" from public."usersInfoTable") as a join public."usersPriviledgesTable" using(id) where "id" != '000000000'`)
        .then(result =>{
            const pageCount = Math.ceil(result.rows.length/15);
            //tbList = result.rows.map( t=> t.table_name)
            res.status(200).json({
                msg: 'ok',
                users: result.rows,
                pagecount: pageCount
            })
        }).catch(err =>{
            res.status(404).json({
                error: err
            })
        });
}

exports.getPermission = async(req, res)=>{
    const page = req.params.page;
    (page=="userpermissions") ? getAllPermissions(req,res) : getUserGraphPermissions(req,res);
}

async function updateSingleUserPermissions(updateValuesArray)
{
    try {
        const updatePermissionsQuery = (`UPDATE public."usersPriviledgesTable" set "print"=${updateValuesArray[2]},  "pdf"=${updateValuesArray[3]}, "image"=${updateValuesArray[4]} where id='${updateValuesArray[0]}';`);
        //const res = await usersdbpool.query(updatePermissionsQuery);
        const updatePermissionsResult = await usersdbpool.query(updatePermissionsQuery);
        const changeUserPermissionQuery = (`UPDATE public."usersInfoTable" set "permissions"='${updateValuesArray[1]}' where id='${updateValuesArray[0]}'`);
        const chnageUserPermissionResult  = await usersdbpool.query(changeUserPermissionQuery);
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
    console.log(userToUpdate.length);
    for(let user of userToUpdate) {
        updateValuesArray = [user['id'], user['permissions'], user['print'],user['pdf'], user['image']];
        console.log(updateValuesArray);
        //updateValuesArray = [userToUpdate[i]['id'], userToUpdate['permissions'], userToUpdate[i]['print'],userToUpdate[i]['pdf'], userToUpdate[i]['image'], userToUpdate[i]['csv'],userToUpdate[i]['xlsx'],userToUpdate[i]['dataTable']];
        
        isUpdateSuccess = await updateSingleUserPermissions(updateValuesArray);
        updatesResults[userToUpdate['id']] = isUpdateSuccess;
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