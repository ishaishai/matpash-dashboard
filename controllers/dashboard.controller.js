const db = require("../config/dbConfig")
const maindbpool = db.maindbpool;

exports.getDashboardById = async(req, res)=>{
    const id = req.params.id;
    maindbpool.query("")//complete query.
    .then(result =>{
        res.status(200).json({
            msg: 'ok',
            dashboard: {}//here result.dashboard.
        })
    }).catch(err =>{
        res.status(404).json({
            error: err
        })
    })
}

exports.deleteDashboardById = async(req, res)=>{
    const id = req.params.id;
    maindbpool.query("")//complete query.
    .then(result =>{
        res.status(200).json({
            msg: 'ok',
        })
    }).catch(err =>{
        res.status(404).json({
            error: err
        })
    })
}

exports.updateDashboardById = async(req, res)=>{
    let { dashboardId, dashboardObject } = req.body;
    dashboardObject = await JSON.parse(dashboardObject);
    maindbpool.query("")//complete query.
    .then(result =>{
        res.status(200).json({
            msg: 'ok',
        })
    }).catch(err =>{
        res.status(404).json({
            error: err
        })
    })
}

exports.addNewDashboard = async(req, res)=>{
    let { dashboardId, dashboardObject } = req.body;
    dashboardObject = await JSON.parse(dashboardObject);
    maindbpool.query("")//complete query.
    .then(result =>{
        res.status(200).json({
            msg: 'ok',
        })
    }).catch(err =>{
        res.status(404).json({
            error: err
        })
    })
}