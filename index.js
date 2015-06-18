var graph = require('./lib/graph');

module.exports = function(){
  return graph.apply( null, arguments );
};

module.exports.vertex = require('./lib/vertex');