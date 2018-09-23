var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var ObjectId = require('mongodb').ObjectID;
cfg = require('../config.json');
var url = "mongodb://"+cfg.db.host+":"+cfg.db.port;
const COLLECTION = "objects";
var db;
// TODO: move to mongoose

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  console.log("Database created!");
  db = database.db(cfg.db.schema);

  db.createCollection(COLLECTION, function(err,res){
      if (err) throw err;
      console.log("Collection "+COLLECTION+" created");
  });
});

exports.getDummy = function(req,res) {
    var item = {"test1":"1","test2":"2"};
    res.setHeader('Content-Type', 'application/json');
    console.log();
    res.send(JSON.stringify(item));
};

function resError(res){
    res.status(404);
    res.send("Oops!")
}

function findQuery(res,query) {
    db.collection(COLLECTION, function(err, collection) {
        collection.findOne(query, function(err, item) {
            res.send(item);
        });
    });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving object: ' + id);
    findQuery(res,{'_id':new ObjectId(id)});
};

exports.findAll = function(req, res) {
    db.collection(COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addObject = function(req, res) {
    var newObject = req.body;
    console.log('Adding object: ' + JSON.stringify(newObject));
    if (newObject){
        db.collection(COLLECTION, function(err, collection) {
            collection.insertOne(newObject, {safe:true}, function(err, dbResponse) {
                if (err) {
                    console.log(err);
                    resError(res);
                } else {
                    console.log('Success: ' + JSON.stringify(dbResponse.ops[0]));
                    res.send(JSON.stringify(dbResponse.ops[0]));
                }
            });
        });
    }
    else
        resError(res);
}

exports.updateObject = function(req, res) {
    var id = req.params.id;
    var object = req.body;
    console.log('Updating object: ' + id);
    console.log(JSON.stringify(object));
    db.collection(COLLECTION, function(err, collection) {
        collection.replaceOne({'_id':new ObjectId(id)}, object, {safe:true}, function(err, dbResponse) {
            if (err) {
                console.log('Error updating object: ' + err);
                resError(res);
            } else {
                console.log('' + JSON.stringify(dbResponse.ops[0]) + ' document(s) updated');
                res.send(JSON.stringify(object));
            }
        });
    });
}

exports.deleteObject = function(req, res) {
    var id = req.params.id;
    var object = req.body;
    delete object._id
    console.log('Deleting object: ' + id);
    db.collection(COLLECTION, function(err, collection) {
        collection.removeOne({'_id':new ObjectId(id)}, {safe:true}, function(err, dbResponse) {
            if (err) {
                console.log(err);
                resError(res);
            } else {
                console.log('Document deleted');
                res.send(JSON.stringify(object));
            }
        });
    });
}