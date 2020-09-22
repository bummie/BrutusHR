const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const Datastore = require('nedb'), db = new Datastore({ filename: 'datastore/users.db', autoload: true });

const MaxCacheSize = 500;
let TransactionCache = [];

function addUser(seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber)  
{
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
        if(error != null){ console.log(error); }
    });
}

function getRowAmount()
{
    db.count({}, function (err, count) 
    {
        console.log(count);
        if(err == null) { return -1; }
        else{ return count; }
    });
}

function createUserDocument(seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber)
{
    return {
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
}

function commitTransactionCache()
{
    console.log("Commiting transaction cache...")
    db.insert(TransactionCache, (error) => 
    {
        if(error != null){ console.log(error); }
        else
        {
            console.log("Cache commited!")
            TransactionCache = [];
        }
    });
}

function migrateOldData()
{
    console.log("Checking if migration is needed.")

    db.count({}, function (err, count) 
    {
        if(err != null) { console.log(err); return; }
        if(count > 0) { console.log("Already parsed CSV-file"); return; }

        addUsersFromCSV("datasett.csv");
    });
}

function addUsersFromCSV(filename)
{
    console.log(`Adding users from CSV file: ${filename} `)
    fs.createReadStream(path.resolve(__dirname, '../csv', filename))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => 
    {
       let userDocument = createUserDocument(row["seq"], row["name/first"], row["name/last"], row["age"], row["street"], row["city"], row["state"], row["latitude"], row["longitude"], row["ccnumber"])
       TransactionCache.push(userDocument);
    })
    .on('end', rowCount => 
    {
        commitTransactionCache();
        console.log(`Added ${rowCount} rows to database.`)
    });
}

module.exports = 
{
    AddUser: (seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber) => addUser(seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber),
    MigrateOldData: () => migrateOldData(),
};