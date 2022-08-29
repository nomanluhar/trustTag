const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/trustTag";

mongoose.connect(MONGO_URL,{useNewUrlParser:true});

const db = mongoose.connection;

require('./model_user.js');
require('./model_master.js');
require('./model_code.js');

db.on('open', () => {
    console.log('Database connected!!!');
});