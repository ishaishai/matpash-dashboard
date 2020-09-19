const db = require("../config/dbConfig")
const maindbpool = db.maindbpool;

exports.getDashboardById = async (req, res) => {
    const { id } = req.query;

    console.log(id);

    try {
        const res = await maindbpool.query("")//complete query.
        res.status(200).json({
            msg: 'ok',
            dashboard: {}//here result.dashboard
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
    }
}

exports.getDashboarNames = async (req, res) => {

    try {
        const res = await maindbpool.query("")//complete query.
        res.status(200).json({
            msg: 'ok',
            dashboard: {}//here result.dashboard
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
    }
}


exports.deleteDashboardById = async (req, res) => {
    const { id } = req.query;

    console.log(id);

    try {
        const res = await maindbpool.query("")//complete query.
        res.status(200).json({
            msg: 'ok',
            dashboard: {}//here result.dashboard
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
    }
}

exports.deleteGraphFromDashboard = async (req, res) => {
    const { dashboardId, graphId } = req.query;

    console.log(id);

    try {
        const res = await maindbpool.query("")//complete query.
        res.status(200).json({
            msg: 'ok',
            dashboard: {}//here result.dashboard
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
    }
}

exports.updateDashboardById = async (req, res) => {
    const { dashboardId, dashboardObject } = req.body;

    try {
        res = await maindbpool.query("")//complete query.

        res.status(200).json({
            msg: 'ok',
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
        console.log(err);
    }
}

exports.addNewDashboard = async (req, res) => {
    const { dashboardId, dashboardObject } = req.body;

    try {
        const res = await maindbpool.query("")//complete query.

        res.status(200).json({
            msg: 'ok',
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
        console.log(err);
    }
}

exports.addNewGraphToDashboard = async (req, res) => {
    const { dashboardId, geaphObject } = req.body;

    try {
        const res = await maindbpool.query("")//complete query.

        res.status(200).json({
            msg: 'ok',
        })
    }
    catch (err) {
        res.status(404).json({
            error: err
        })
        console.log(err);
    }
}