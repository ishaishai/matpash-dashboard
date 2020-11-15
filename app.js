const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Load routes
app.use('/api/', require('./routes/authRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/permissions', require('./routes/permissionsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/tables', require('./routes/tables.route'));
app.use('/api/dashboard', require('./routes/dashboard.route'));
app.use('/api/view', require('./routes/viewRoutes'));

if (process.env.NODE_ENV === 'production') {
  // Serve up production assets
  app.use(express.static('client/build'));

  // Serve up the index.html
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});