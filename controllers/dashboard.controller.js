const db = require("../config/dbConfig")
const { dashboarddbpool, maindbpool } = db

exports.getDashboardById = async (req, res) => {
    const { id } = req.params;

    const userId = '305101560'; //** here need to get user id from token.

    try {

        //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
        const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${userId}'`;
        let result = await dashboarddbpool.query(queryPullDashboard)//complete query.

        if (result.rows.length === 0) throw new Error('user has no permisson to dashboard');

        let graphsExtracted = result.rows[0][`dashboard${id}`].split(',');

        graphsExtracted = graphsExtracted.map(num => `'${num}'`).join(',');

        //extract the string of the numbers from '1,2,3' to `'1','2','3'` and use the following
        const queryPullGraphs = `select * from public."graphsInfoTable" where "graphsInfoTable"."index" in (${graphsExtracted})`;

        result = await dashboarddbpool.query(queryPullGraphs);

        const graphList = result.rows;

        const dashboardToReturn = {
            id: id,
            graphList: []
        };


        for(graph of graphList) {

            const graphToAdd = {}

            graphToAdd.index = graph.index;
            graphToAdd.type = graph.type;
            graphToAdd.title = graph.title;
            graphToAdd.subtitle = graph.subtitle;
            graphToAdd.xAxisTitle = graph.xAxisTitle;
            graphToAdd.yAxisTitle = graph.yAxisTitle;
            graphToAdd.xAxisColumn = graph.xAxisColumn;
            graphToAdd.yAxisColumn = graph.yAxisColumn;
            graphToAdd.xAxisCatagoryRange = [];
            graphToAdd.legend = graph.legend;
            graphToAdd.series = []

            graphToAdd.layoutPosition = {
                position: graph.position,
                width: graph.width,
                height: graph.height,
                xPos: graph.xPos,
                yPos: graph.yPos,
                layoutIndex: graph.layoutIndex
            }


            const xAxisColumnName = graph.xAxisColumn.split('.')[1];
            const xAxisTableName = graph.xAxisColumn.split('.')[0];
            const fromStr = graph.xAxisCatagoryRange.split('-')[0];
            const toStr = graph.xAxisCatagoryRange.split('-')[1];


            //extract enumerated value of rows for the wanted range 
            const queryGetEnumeratedValues = `select rownum from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp
            where "${xAxisColumnName}" like '%${fromStr}%' or "${xAxisColumnName}" like '%${toStr}%'`;

            result = await maindbpool.query(queryGetEnumeratedValues);

            const fromNum = result.rows[0].rownum;
            const toNum = result.rows[1].rownum;

            //from previous statement we get two values for the enumerated range lets say 2 and 8. now we want all real values between them.
            const queryGetXAxisCatagory = `select "${xAxisColumnName}" from (select "${xAxisColumnName}",row_number() over(order by 1) as "rownum"  from public."${xAxisTableName}") as tmp where
            rownum >=${fromNum} and rownum<=${toNum}`;

            result = await maindbpool.query(queryGetXAxisCatagory);

            graphToAdd.xAxisCatagoryRange = result.rows.map(obj => Object.values(obj)[0]);

            //get all the series of dashboard and extract from it which series to the right graph by its index
            const queryDashSeries = `select * from public."dashboard${id}Series"`;

            result = await dashboarddbpool.query(queryDashSeries);

            const seriesList = result.rows;

      
            for(series of seriesList) {

                const tableName = series.serieName.split('.')[0]
                const columnName = series.serieName.split('.')[1]

                const seriesToAdd = {
                    name: series.serieName, //maybe cahnge this to name
                    colr: series.color,
                    data: []
                }

                //for each serie needed to pull its data so serieName needed to be split by dot and then be used like
                //maybe not use range for series because all data in range of xAxis is enough
                const querySerie = `select "${columnName}" from (select "${columnName}",row_number() over(order by 1) as "rownum"  from public."${tableName}") as tmp where
                            rownum >=${fromNum} and rownum<=${toNum}`;

                result = await maindbpool.query(querySerie);

                const dataToAdd =  result.rows.map(obj => Object.values(obj)[0]); 

                seriesToAdd.data = dataToAdd;

                graphToAdd.series.push(seriesToAdd);
            }

            dashboardToReturn.graphList.push(graphToAdd);

        }

        console.log(dashboardToReturn)


        res.status(200).json({
            msg: 'ok',
            dashboard: dashboardToReturn
        })
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            error: err.message
        })
    }
}

exports.getDashboarNames = async (req, res) => {

    try {

        //this will get you a number. if there are 2 dashboards then 2. build strings like 'Dash 1' 'Dash 2'.
        const res = await maindbpool.query(`SELECT max(ordinal_position)-1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name   = 'dashboardPriviledgesTable';`)//complete query.

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
        //that gives you list of numbers like '1,2,3', or empty if user or dashboard doesnt exist.
        const queryPullDashboard = `select dashboard${id} from public."dashboardPriviledgesTable" where "dashboardPriviledgesTable"."userId" = '${sessionUserID}'`;

        //use the string of the numbers from orevious -> '1,2,3' and delete them from graphsInfoTable
        const queryDeleteGraphs = `DELETE FROM public."graphsInfoTable" WHERE "index" in (${result})`;

        //erase every trail of those graphs in dash1 from any user
        const res = await maindbpool.query(`update public."dashboardPriviledgesTable" set dashboard${id} = '';`)//complete query.

        const queryDeleteDashSeriesTable = `DROP TABLE public."dashboard${id}Series";`;
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