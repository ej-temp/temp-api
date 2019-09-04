const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/temperatures', require('./routes/tempratures'));
app.use('/', require('./routes/network'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
