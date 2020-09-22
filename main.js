let express = require("express");
let handlebars  = require("express-handlebars");
const WebServerPort = 1337;

let app = express();
app.set("view engine", "hbs");

//Sets handlebars configurations (we will go through them later on)
app.engine("hbs", handlebars(
{
	layoutsDir: __dirname + '/views/layouts', 
	extname: 'hbs'
}));

app.use(express.static('public'))

app.get('/', (req, res) => 
{
	//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
	res.render('Main', { layout : "Index" });
});

app.get('/add', (req, res) => 
{
	//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
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

	//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
	res.render('ListUsers', { layout : "Index", users: fetchedUsers });
});

app.listen(WebServerPort, () => console.log(`Brutus listening on port: ${WebServerPort}`));