const xlsx = require("xlsx");
const db = require("../conf/dbconf")
const usersdbpool = db.usersdbpool;


exports.getViewPermission = async(req, res)=>{
    console.log('page:',  req.query.page);

    let countRes = await usersdbpool.query('SELECT count(*) from public."dashboardPriviledges" ;')
    const totalCount = countRes.rows[0].count;

    const perPage = 20;
    const offset = perPage *  (  parseInt(req.query.page) - 1 ) ;
    const pageCount = Math.ceil(parseInt(totalCount)/parseInt(perPage));
    usersdbpool.query('SELECT * from public."dashboardPriviledges" order by userid asc limit $1 offset $2  ;', [perPage, offset])
    .then(result =>{

        let resOutput = [];
        let item = {};
        let useridValue;
        for(let i =0; i < result.rows.length; i++){
            item= result.rows[i];
            useridValue = item["userid"] ;
            delete item["userid"]; 
            resOutput.push( {userid: useridValue,dashboards: item } );
        }

        res.status(200).json({
            msg: 'ok',
            users: resOutput,
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


async function updateSingleViewPermissions(updateValuesArray)
{
    console.log("updateValuesArray",updateValuesArray);
    try {
        const res = await usersdbpool.query('UPDATE public."dashboardPriviledges" set "dashboard1"=$2, "dashboard2"=$3, "dashboard3"=$4, "dashboard4"=$5, "dashboard5"=$6  where "userid"=$1;',updateValuesArray);
        return true;
    } catch(e){
        console.log(e);
        return false;
    }
};

exports.saveViewPermission = async(req, res)=>{

    console.log('********saveViewPermission***********', req.body);
    const userToUpdate = req.body ;
    let updateValuesArray = null;
    let updatesResults = {};
    let isUpdateSuccess = false;


    for(var i=0; i < userToUpdate.length ; i++) {
        updateValuesArray = [userToUpdate[i]['userid'], userToUpdate[i]['dashboards']['dashboard1'],userToUpdate[i]['dashboards']['dashboard2'],userToUpdate[i]['dashboards']['dashboard3'],userToUpdate[i]['dashboards']['dashboard4'],userToUpdate[i]['dashboards']['dashboard5']];
        isUpdateSuccess = await updateSingleViewPermissions(updateValuesArray);
        updatesResults[userToUpdate[i]['userid']] = isUpdateSuccess;
    }
  
    res.status(200).json({
        msg: 'ok',
        updatesResults: updatesResults
    });

}



exports.userinfo = async(req, res)=>{
    
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