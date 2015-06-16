var Graph   = require('./graph');
var Vertex  = require('./vertex');

var DirectedGraph = module.exports = function( options ){
  return Object.create( utils.extend({
    options:  utils.defaults( options || {}, {
                immutable: true
              })

  , map:      {}
  }, Graph.proto, DirectedGraph.proto ) );
};

module.exports.proto = {

};