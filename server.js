require('./models/db.js')
const express = require('express');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { routeValidation,authentication } = require('./controllers/valiidation/handleValidation.js');

var cookies = require("cookie-parser");

app.use(cookies());
const authRoute = require('./controllers/routers/authUser.js');
const adminRoute = require('./controllers/routers/adminMaster.js');
const codeRoute = require('./controllers/routers/adminCode.js');
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));



app.use('/login', authRoute);
app.use('/admin',authentication,routeValidation, adminRoute);
app.use('/admin/code', codeRoute);

app.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/login');
});

app.set('views', path.join(__dirname, '/views'));
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'index', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'hbs');








app.listen(5000, () => {
    console.log('Server is running on port 5000');
});