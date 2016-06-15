var auth = process.env.client_id;
var https = require('https');

function search(query, page, clbk){
  var pathStr = '/3/gallery/search/top/' + page + '?q=' + query;
  var options = {
    protocol : 'https:',
    host : 'api.imgur.com',
    method : 'GET',
    headers: { 
      Authorization: 'Client-ID ' + auth
    },
    path: pathStr
  };

  var imgur = https.request(options, function(response){
    var data = '';
    response.on('data', function(d){
      data += d.toString();
    });
    response.on('end', function(){
      clbk(data);
    });
  });
  imgur.end();

}

module.exports.search = search;