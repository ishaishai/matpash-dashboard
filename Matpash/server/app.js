const express = require("express");
const upload = require("express-fileupload");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
const uploadRoute = require('./routes/upload.route');
const tablesRoute = require('./routes/tables.route');
const usersRoute = require('./routes/users.route');
const userPermissionRoute = require('./routes/permission.route');
const userViewRoute = require('./routes/view.route');
//middleware
app.use(cors());
app.use(express.json());
app.use(upload());

app.use('/upload', uploadRoute);
app.use('/tables', tablesRoute);
app.use('/users', usersRoute);
app.use('/permissions',userPermissionRoute)
app.use('/view', userViewRoute);





//assigning server to port 5000
app.listen(5000,()=> {
    console.log("Server has started on port 5000");
}); 



