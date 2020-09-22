const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const Datastore = require('nedb'), db = new Datastore({ filename: 'datastore/users.db', autoload: true });

let addUser = (seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber) =>  
{
    console.log(seq);
    let userDocument = 
    {
        "Seq": seq,
        "Firstname": firstname,
        "Lastname": lastname,
        "Age": age,
        "Street": street,
        "City": city,
        "State": state,
        "Latitude": latitude,
        "Longitude": longitude,
        "CCnumber": ccnumber
    };

    db.insert(userDocument, (error, newDoc) => 
    {
        console.log(error);
        console.log(newDoc);
    });
}

let addUsersFromCSV  = (filepath) =>  
{
    fs.createReadStream(path.resolve(__dirname, 'assets', 'parse.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

    const csvFilePath='<path to csv file>'
    const csv = require('csvtojson')
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        console.log(jsonObj);
        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */ 
    });
    
    //addUser();
}

module.exports = 
{
    AddUser: (seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber) => addUser(seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber),
};