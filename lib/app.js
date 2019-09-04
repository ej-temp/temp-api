const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api/v1/temperatures', require('./routes/tempratures'));
app.use('', require('./routes/network'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
