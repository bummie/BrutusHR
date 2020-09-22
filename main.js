let express = require("express");
let handlebars  = require("express-handlebars");
let dbHandler = require("./scripts/dbhandler");

const WebServerPort = 1337;

dbHandler.AddUser(100000, "Charlotte", "Neal", 27, "Vivti Terrace", "Davicefa", "SD", -80.21522, -54.74312, 30097184856656);

let app = express();
app.set("view engine", "hbs");

app.engine("hbs", handlebars(
{
	layoutsDir: __dirname + '/views/layouts', 
	extname: 'hbs'
}));

app.use(express.static('public'))

app.get('/', (req, res) => 
{
	res.render('Main', { layout : "Index" });
});

app.get('/add', (req, res) => 
{
	res.render('AddUser', { layout : "Index" });
});

app.get('/users', (req, res) => 
{
	let fetchedUsers = [ 
		{
			//Maggie,Elliott,26,Uvaal Glen,Rikzigdu,HI,-24.72204,83.54313,5133235842426026
			FirstName: "Ola",
			LastName: "Ola",
			Age: 22,
			Address: "Ola",
			Lat: 0.0,
			Lon: 0.0
		},
		{
			//Maggie,Elliott,26,Uvaal Glen,Rikzigdu,HI,-24.72204,83.54313,5133235842426026
			FirstName: "Ola",
			LastName: "Ola",
			Age: 22,
			Address: "Ola",
			Lat: 0.0,
			Lon: 0.0
		},
		{
			//Maggie,Elliott,26,Uvaal Glen,Rikzigdu,HI,-24.72204,83.54313,5133235842426026
			FirstName: "Ola",
			LastName: "Ola",
			Age: 22,
			Address: "Ola",
			Lat: 0.0,
			Lon: 0.0
		},
		{
			//Maggie,Elliott,26,Uvaal Glen,Rikzigdu,HI,-24.72204,83.54313,5133235842426026
			FirstName: "Ola",
			LastName: "Ola",
			Age: 22,
			Address: "Ola",
			Lat: 0.0,
			Lon: 0.0
		}
	];

	res.render('ListUsers', { layout : "Index", users: fetchedUsers });
});

app.listen(WebServerPort, () => console.log(`Brutus listening on port: ${WebServerPort}`));