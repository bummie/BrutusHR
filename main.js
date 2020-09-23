const express = require('express');
const handlebars  = require('express-handlebars');
const bodyParser = require('body-parser');
const dbHandler = require('./scripts/dbhandler');

const WebServerPort = 1337;

dbHandler.MigrateOldData();

let app = express();
app.set('view engine', 'hbs');

app.engine('hbs', handlebars(
{
	layoutsDir: __dirname + '/views/layouts', 
	extname: 'hbs'
}));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => 
{
	res.render('Main', { layout : 'Index'});
});

app.get('/stats', (req, res) => 
{
	dbHandler.GetRowAmount().then(countData => 
	{
		dbHandler.GetAllUsers().then(usersData => 
		{
			res.render('Statistics', { layout : 'Index', count: countData, users: usersData });
		});
	});
});

app.get('/add', (req, res) => 
{
	res.render('AddUser', { layout : 'Index' });
});

app.post('/add', (req, res) => 
{
	dbHandler.AddUser(req.body).then(data => 
	{
		let messageData = "Could not add user, data missing!";
		if(data != null)
		{
			messageData = `${data.Firstname} ${data.Lastname} was added to the database!`;
		}

		res.render('AddUser', { layout : 'Index', message: messageData, user: data });
	});
});

app.get('/users', (req, res) => 
{
	let page = 0;
	if(req.query.page != null) { page = req.query.page; }
	dbHandler.GetUsersFromPage(page).then(data => 
	{
		let maxPage = Number(data.MaxPage);

		if(page > maxPage){ page = maxPage; }
		if(page < 0){ page = 0; }
		
		let pageDecrement = Number(page) - 1;
		let pageIncrement = Number(page) + 1;

		if(pageDecrement < 0){ pageDecrement = 0; }
		if(pageIncrement > maxPage){ pageIncrement = maxPage; }

		res.render('ListUsers', { layout : 'Index', users: data.Users, pageInc: pageIncrement, pageDec: pageDecrement, MaxPage: maxPage, CurrentPage: page });
	});
});

app.get('/search', (req, res) => 
{
	dbHandler.SearchUsers(req.query.query).then(data => 
	{
		res.render('SearchUsers', { layout : 'Index', users: data });
	});
});

app.get('/user', (req, res) => 
{
	dbHandler.GetUserById(req.query.id).then(data => 
	{
		if(data == null)
		{
			res.render('UserNotFound', { layout : 'Index' });
		}else
		{
			res.render('UserPage', { layout : 'Index', user: data });
		}
	});
});

app.get('*', function(req, res)
{
	res.render('PageNotFound', { layout : 'Index' });
});

app.listen(WebServerPort, () => console.log(`Brutus listening on port: ${WebServerPort}`));