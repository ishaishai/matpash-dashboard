const db = require('../config/dbConfig');
const { usersdbpool,dashboarddbpool } = db;


exports.getViewPermission = async(req, res)=>{
    console.log('page:',  req.query.page);

    let countRes = await dashboarddbpool.query(`SELECT count(*)-1 from public."dashboardPriviledgesTable";`)
    const totalCount = countRes.rows.length;
    const dashNamesBool = {};
    const perPage = 20;
    const offset = perPage *  (parseInt(req.query.page) - 1 ) ;
    const pageCount = Math.ceil(totalCount/perPage);
    
    let usersAdminStrList = '';
    dashboarddbpool.query(`SELECT * from public."dashboardNames" order by "index" asc`)
    .then(result => {
        let dashNames = result.rows;  
        for(let dash of dashNames) {
            dashNamesBool[Object.values(dash)[1]] = { 
                key: `dashboard${Object.values(dash)[0]}`,
                access: false,
            }
        }
    }).then(()=> {//////get first all none manager users and then concat them and put in the first statement because these are two different dbs
        usersdbpool.query(`select "username" from public."usersInfoTable" where "permissions"='מנהל'`)
        .then(result => {
            console.log(result.rows);
            for(let obj of result.rows) {
                usersAdminStrList += `'${obj.username}',`;
            }
            usersAdminStrList = usersAdminStrList.slice(0,-1);
            console.log(usersAdminStrList);
            dashboarddbpool.query(`SELECT * from public."dashboardPriviledgesTable" where "username" not in (${usersAdminStrList}) order by "username" asc limit ${perPage} offset ${offset} ;`)
            .then(result =>{
                
                let resOutput = [];
                let item = {};
                let usernameValue;
                for(let i =0; i < result.rows.length; i++){
                    const dashNames = JSON.parse(JSON.stringify(dashNamesBool));
                    item= result.rows[i];
                    usernameValue = item["username"] ;
                    delete item["username"]; 
                    console.log(dashNames);
                    for(let obj of Object.keys(item) ) {
                        console.log(item[obj]);
                        if(item[obj]!=null) {
                            for(let dash of Object.keys(dashNamesBool)) {
                                if(dashNames[dash].key == obj) {
                                    dashNames[dash].access =true;
                                    break;
                                }
                            }
                        }
                        
                        //console.log(Object.keys(obj));
                        ///dashDict[Object.keys(obj)] 
                    }
                    console.log(dashNames);

                    resOutput.push( {username: usernameValue,dashboards: dashNames } );
                }

                res.status(200).json({
                    msg: 'ok',
                    users: resOutput,
                    totalCount:totalCount,
                    perPage: perPage,
                    pageCount:pageCount,
                    dashNamesBoolean: dashNamesBool
                })
            }).catch(err =>{
            res.status(404).json({
                error: err
            })
        })
        }).catch(err =>{
            res.status(404).json({
                error: err
            })
        })
    });
}


async function updateSingleViewPermissions(updateStatement)
{
    try {
        const res = await dashboarddbpool.query(updateStatement);
        return true;
    } catch(e){
        console.log(e);
        return false;
    }
};

exports.saveViewPermission = async(req, res)=>{

    console.log('********saveViewPermission***********');
    const usersToUpdate = req.body.data;
    const permissionsUsernames = req.body.permissionsUsernames;
    let updatesResults = {};
    let isUpdateSuccess = false;

   

    let adminDashboardsResult = await dashboarddbpool.query(`SELECT * from public."dashboardPriviledgesTable" where "username" = 'super'`);

    let adminDashs = adminDashboardsResult.rows[0];

    for(var i=0; i < usersToUpdate.length ; i++) {
        let updateStatement = `update public."dashboardPriviledgesTable" set `;

        if(permissionsUsernames.includes(usersToUpdate[i].username)) {
            let username = usersToUpdate[i].username;

            console.log(adminDashs);
            for(let dashName of Object.keys(usersToUpdate[i].dashboards)) {
                updateStatement+=`"${usersToUpdate[i].dashboards[dashName].key}" = ${(usersToUpdate[i].dashboards[dashName].access) ? "'"+adminDashs[usersToUpdate[i].dashboards[dashName].key]+"'"  : null },`;
            }
            updateStatement = updateStatement.slice(0, -1);
           
            updateStatement+= ` where "username"='${username}'`;
            console.log(updateStatement);
            isUpdateSuccess = await updateSingleViewPermissions(updateStatement);
            
        }
        updatesResults[usersToUpdate[i]['username']] = isUpdateSuccess;
        
    }
  
    res.status(200).json({
        msg: 'ok',
        //updatesResults: updatesResults
    });

}



exports.userinfo = async(req, res)=>{
    
    usersdbpool.query('SELECT * from public."usersInfoTable" where username=$1 and username!=$2;',[req.params.username,'super'])
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