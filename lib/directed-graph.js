var Graph   = require('./graph');
var Vertex  = require('./vertex');

var DirectedGraph = module.exports = function( options ){
  return Object.create( utils.extend({
    options:  utils.defaults( options || {}, {
                immutable:  true
              , acyclic:    false
              })

  , map:      {}
  }, DirectedGraph.proto ) );
};

module.exports.proto = utils.extend( {}, Graph.proto );

module.exports.proto.connect = function( a, b, weight ){
  this.validateVertices( a, b );

  if ( this.options.acyclic ){
    if ( this.doesCycle( a, b ) ){
      throw new Error('Invalid operation: Adds cycle to graph');
    }
  }

  g.map[ a ].edges[ b ] = edgeWeight;

  var va = g.map[ a ];
  var vb = g.map[ b ];

  if ( va.outgoing.indexOf( b ) === -1 ){
    va.outgoing.push( b );
  }
  
  if ( vb.incoming.indexOf( a ) === -1 ){
    vb.incoming.push( a );
  }

  return g;
};