const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const Datastore = require('nedb'), db = new Datastore({ filename: 'datastore/users.db', autoload: true });
const UsersPerPage = 100;

let TransactionCache = [];

function addUser(postData)  
{
    return new Promise( (resolve, reject) => 
    {
        if(postData == null) { resolve(null); return; }
        if(postData.firstname == null || postData.firstname == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.lastname == null || postData.lastname == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.age == null || postData.age == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.street == null || postData.street == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.city == null || postData.city == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.state == null || postData.state == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.latitude == null || postData.latitude == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.longitude == null || postData.longitude == "") { console.log("Data missing on insert."); resolve(null); return; }
        if(postData.ccnumber == null || postData.ccnumber == "") { console.log("Data missing on insert."); resolve(null); return; }
        
        let sequenceNumber = -1;

        findHighestSequenceNumber().then((seq) => 
        {
            if(seq != null) { sequenceNumber = Number(seq) + 1; }
            
            let userDocument = createUserDocument(sequenceNumber, 
                                            postData.firstname,
                                            postData.lastname,
                                            postData.age,
                                            postData.street,
                                            postData.city,
                                            postData.state,
                                            postData.latitude,
                                            postData.longitude,
                                            postData.ccnumber);

            db.insert(userDocument, (error, newDoc) => 
            {
                if(error != null){ console.log(error); resolve(null); }
                resolve(newDoc);
            });
        });
    });

}

function getRowAmount()
{
    return new Promise( (resolve, reject) => 
    {
        db.count({}, function (error, count) 
        {
            if(error != null){ console.log(error); reject(error); }
            resolve(count);
        });
    });
}

function createUserDocument(seq, firstname, lastname, age, street, city, state, latitude, longitude, ccnumber)
{
    return {
        Seq: Number(seq),
        Firstname: firstname,
        Lastname: lastname,
        Age: Number(age),
        Street: street,
        City: city,
        State: state,
        Latitude: Number(latitude),
        Longitude: Number(longitude),
        CCNumber: Number(ccnumber)
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

function findHighestSequenceNumber()
{
    return new Promise( (resolve, reject) => 
    {
        db.findOne({}).sort({Seq: -1}).exec( (error, doc) => 
        {
            if(error != null){ console.log(error); reject(null); }
            resolve(doc.Seq);
        });
    });
}

function getUserById(id)
{
    return new Promise( (resolve, reject) => 
    {        
        if(id == undefined || id == null) { resolve(null); }

        db.findOne({ _id: id}, (error, doc) =>
        {
            if(error != null){ console.log(error); reject(null); }
            resolve(doc);
        });
    });
}

function getUserBySequence(id)
{
    return new Promise( (resolve, reject) => 
    {
        if(id == undefined || id == null) { resolve(null); }

        db.findOne({ Seq: id}, (error, doc) =>
        {
            if(error != null){ console.log(error); reject(null); }
            resolve(doc);
        });
    });
}

function searchUsers(query)
{
    return new Promise( (resolve, reject) => 
    {
        if(query == undefined || query == null) { resolve({}); }
        let searchRegEx = new RegExp(query, "i");

        db.find({ $or: [
        { Seq: searchRegEx },
        { Firstname: searchRegEx },
        { Lastname: searchRegEx },
        { Age: searchRegEx },
        { Street: searchRegEx },
        { City: searchRegEx },
        { State: searchRegEx },
        { Latitude: searchRegEx },
        { Longitude: searchRegEx },
        { CCNumber: searchRegEx }
        ]}, (error, docs) =>
        {
            if(error != null){ reject(error); }
            resolve(docs);
        });
    });
}

function getAllUsers()
{
    return new Promise( (resolve, reject) => 
    {
        db.find({}).sort({Seq: 1}).limit(300).exec((error, docs) => 
        {
            if(error != null){ reject(error); }
            resolve(docs);
        });
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

function getUsersFromPage(page)
{
    return getRowAmount().then( count => 
    {
        let maxPage = Math.floor(count / UsersPerPage);

        if(page < 0) { page = 0; }
        if(page > maxPage) { page = maxPage; }

        let skipAmount = page * UsersPerPage;

        return new Promise( (resolve, reject) => 
        {
            db.find({}).sort({Seq: 1}).skip(skipAmount).limit(UsersPerPage).exec((error, docs) => 
            {
                if(error != null){ reject(error); }
                resolve({Users: docs, MaxPage: maxPage});
            });
        });
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
       let userDocument = createUserDocument(Number(row["seq"]),
                                            row["name/first"], 
                                            row["name/last"], 
                                            Number(row["age"]), 
                                            row["street"], 
                                            row["city"], 
                                            row["state"], 
                                            Number(row["latitude"]), 
                                            Number(row["longitude"]), 
                                            Number(row["ccnumber"]));
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
    AddUser: (postData) => addUser(postData),
    MigrateOldData: () => migrateOldData(),
    GetAllUsers: () => getAllUsers(),
    GetUsersFromPage: (page) => getUsersFromPage(page),
    SearchUsers: (query) => searchUsers(query),
    GetRowAmount: () => getRowAmount(),
    GetUserById: (id) => getUserById(id),
    GetUserBySequence: (id) => getUserBySequence(id),
};