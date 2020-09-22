const express = require("express");
const handlebars  = require("express-handlebars");
const bodyParser = require('body-parser');
const dbHandler = require("./scripts/dbhandler");

const WebServerPort = 1337;

dbHandler.MigrateOldData();

let app = express();
app.set("view engine", "hbs");

app.engine("hbs", handlebars(
{
	layoutsDir: __dirname + '/views/layouts', 
	extname: 'hbs'
}));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => 
{
	res.render('Main', { layout : "Index" });
});

app.get('/add', (req, res) => 
{
	res.render('AddUser', { layout : "Index" });
});

app.post('/add', (req, res) => 
{
	console.log('Got body:', req.body);
	dbHandler.AddUser(req.body);
	res.render('AddUser', { layout : "Index" });
});

app.get('/users', (req, res) => 
{
	dbHandler.GetAllUsers().then(data => 
	{
		res.render('ListUsers', { layout : "Index", users: data });
	});
});

app.get('/search', (req, res) => 
{
	dbHandler.SearchUsers(req.query.query).then(data => 
	{
		res.render('SearchUsers', { layout : "Index", users: data });
	});
});

app.listen(WebServerPort, () => console.log(`Brutus listening on port: ${WebServerPort}`));