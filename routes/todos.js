var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var _ = require('underscore-node');

var db = mongojs('mongodb://chethanc:chethanc@ds163796.mlab.com:63796/meantodo')

// endpoint for the start of the app
router.get('/', function(req, res, next){
    db.todos.find(function(err, docs){
        if(err){
            console.log(err.message);
        }
        else{
            res.send(docs);
        }
    });    
});

router.get('/todos', function(req, res){
    var query = req.query;
    var documents;
    if (query.hasOwnProperty('isCompleted')){
        var qIsCompleted = (query.isCompleted == 'true');
        db.todos.find({isCompleted: qIsCompleted}, 
        function(error, docs){
            if(error){
                res.send(error.message);
            }else{
                if(query.hasOwnProperty('q')){
                    documents = _.filter(docs, function(document){
                        return (document.text.indexOf(query.q) >= 0);
                    });
                    res.status(200).send(documents);
                }else{
                    res.status(200).send(docs);
                }
                
            }
        });
    }else if (query.hasOwnProperty('q')){
        var queryString = ".*"+query.q+".*" ;
        //to get around the two level filtering
            db.todos.find({"text" : {$regex : queryString}}, 
            function(error, docs){
                if(error){
                    res.send(error.message);
                }else{
                    res.status(200).send(docs);
                }
            });
        }
});


router.get('/todos/:id', function(req, res, next){
    db.todos.findOne({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, docs){
        if(err){
            console.log(err.message);
        }
        else{
            res.send(docs);
        }
    });
});


router.post('/todos', function(req, res, next){
    var body = req.body;
    var description = body.text;
    var completed = body.isCompleted;
    if (typeof description !== 'undefined' && typeof completed !== 'undefined'){
        var body = _.pick(body, 'text', 'isCompleted');
        db.todos.save(body);
        res.status(200).send(body);
    }
    else{
        res.status(400).send();
    }
});


router.post('/todo/:id', function(req, res, next){
    var body = req.body;
    var description = body.text;
    var completed = body.isCompleted;
    if (typeof description !== 'undefined' && typeof completed !== 'undefined'){
        db.todos.update({
            _id: mongojs.ObjectId(req.params.id)
        }, {
            text: description,
            isCompleted: completed
        });
        res.status(200).send(body);
    }
    else{
        res.status(404).send('improper data');
    }
});


router.delete('/:id', function(req, res, next){
    db.todos.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, function(err, body){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(body);
        }
    });
});


module.exports = router;