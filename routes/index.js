var express = require('express');
var router = express.Router();
var imgur = require('../imgur.js');
var dataBase = require('../connect.js');

// GET instructions for using image search abstraction layer
router.get('/', function(req, res, next){
  res.send('Please enter a search term after the domain name to search for image data or visit ' + req.headers.host + '/api/lastest to see the latest searches. ')
});

// GET search results
router.get('/:search', function(req, res, next) {
  var query =  req.params.search;
  var page = req.query.offset || 0;

  dataBase(dataBase.upload, query);

  imgur.search(query, page, function(data){
    var searchRtn = JSON.parse(data).data.map(function(imageData){
       return {'title': imageData.title,
        'link': imageData.link,
        'score': imageData.score,
        'views': imageData.views
      };
    });
    res.end(JSON.stringify(searchRtn));
  });

});

// GET last 10 uploads
router.get('/api/latest', function(req, res){
  dataBase(dataBase.getLatest, null, function(rows){
    res.end(JSON.stringify(rows));
  });

})

module.exports = router;
