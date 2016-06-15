var pg = require('pg');
var dbUrl = process.env.DATABASE_URL;
var table = process.env.TABLE;
var rows = [];
var rollback = function(client, done) {
  client.query('ROLLBACK', function(err) {
    return done(err);
  });
};

function dataBase(action, searchStr, clbk){
  pg.connect(dbUrl, function(err, client, done){
  //Handle Database connection errors
    if(err){
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    var query = action(client, done, searchStr);

    query.on('end', function(){
      done();
      if(clbk){
        clbk(rows);
      }
    });
  });
}

function upload(client, done, searchStr){
  var tableCols = "(query, date)";
  var values = "VALUES ($1, CURRENT_TIMESTAMP)"
  var request = ['INSERT INTO', table, tableCols, values].join(' ');
  return client.query(request, [searchStr], function(err, result){
    if(err){
      return rollback(client, done); 
    }
  });
}

function getLatest(client, done){
  var tableCols = "(query, date)";
  var request = ['SELECT * FROM', table, 'ORDER BY date DESC LIMIT 10'].join(' ');
  return client.query(request, function(err, result){
    if(err){
      return rollback(client, done); 
    }
    rows = result.rows;
  });
}

module.exports = dataBase;
module.exports.upload = upload;
module.exports.getLatest = getLatest;