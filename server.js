const app = require('./src/app');
const mongoose = require('mongoose');
const config = require('./src/app.config');
const port = process.env.PORT || 3000;

mongoose.connect(config.mongoUrl);

app.listen(port);