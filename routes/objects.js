var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;
var ObjectId = require('mongodb').ObjectID;
cfg = require('../config.json');
var url = "mongodb://"+cfg.db.host+":"+cfg.db.port;
const COLLECTION = "objects";
var db;
// TODO: refactor to separate module and move to mongoose

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

function buildIdObject(id){ 
    try {
        return new ObjectId(id)
    }
    catch(err){
        return id
    }
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
    findQuery(res,{'_id':buildIdObject(id)});
};

exports.findAll = function(req, res) {
    db.collection(COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addObjectReq = function(req, res) {
    var newObject = req.body;
    console.log('Adding object: ' + JSON.stringify(newObject));
    addObject(newObject,function(respObj){
        res.send(JSON.stringify(respObj));
    }, function(err){
        resError(res);
    });
}

exports.addObject = function(newObject,okCallback,errCallback) {
    if (newObject){
        delete newObject._id
        db.collection(COLLECTION, function(err, collection) {
            collection.insertOne(newObject, {safe:true}, function(err, dbResponse) {
                if (err) {
                    console.log(err);
                    errCallback(err);
                } else {
                    var createdObject = dbResponse.ops[0];
                    okCallback(createdObject)
                }
            });
        });
    }
    else
        errCallback(null);
}

exports.updateObjectReq = function(req, res) {
    var id = req.params.id;
    var object = req.body;
    console.log('API Updating object: ' + id);
    console.log(JSON.stringify(object));

    updateObject(object,
        function(respObject){
            res.send(JSON.stringify(resObject));
        },function(err){
            resError(res);
        });
}

exports.updateObject = function(object,okCallback,errCallback){
    console.log('Updating object: ');
    console.log(object);
    var id = object._id
    if (object._id){
        delete object._id;
    }
    
    db.collection(COLLECTION, function(err, collection) {
        collection.replaceOne({'_id':buildIdObject(id)}, object, {safe:true}, function(err, dbResponse) {
            if (err) {
                errCallback(err);
            } else {
                if (dbResponse.matchedCount>0){
                    object._id = id;
                    okCallback(object)
                }
                else{
                    // TODO produce valid error object
                    errCallback(null)
                }
                
            }
        });
    });
}

exports.deleteObjectReq = function(req, res) {
    var id = req.params.id;
    var object = req.body;
    
    deleteObject(object,function(respObj){
        res.send(JSON.stringify(respObj));
    }, function(err){
        resError(res);
    })
}

exports.deleteObject = function(object,okCallback,errCallback) {
    
    var id = object._id
    delete object._id
    console.log('Deleting object: ' + id);
    try {
        db.collection(COLLECTION, function(err, collection) {
            collection.removeOne({'_id':buildIdObject(id)}, {safe:true}, function(err, dbResponse) {
                if (err) {
                    errCallback(err);
                } else {
                    object._id = id;
                    okCallback(object);
                }
            });
        });
    }
    catch(err) {
        errCallback(err)
    }
}