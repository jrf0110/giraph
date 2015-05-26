module.exports = function(){
  return module.exports.g.apply( null, arguments );
};

module.exports.g = require('./lib/graph');
module.exports.dg = require('./lib/directed-graph');
module.exports.dag = require('./lib/directed-acyclic-graph');
module.exports.vertex = require('./lib/vertex');