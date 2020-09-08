const express = require('express');
const upload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(upload());

// Load routes
app.use('/api/', require('./routes/authRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/upload', require('./routes/upload.route'));
app.use('/tables', require('./routes/tables.route'));

app.get('/', (req, res) => {
  res.send('matpash-server');
});

app.listen(5000, () => {
  console.log('Server has started on port 5000');
});
