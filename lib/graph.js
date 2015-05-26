var utils = require('./utils');
var Vertex = require('./Vertex');

var Graph = module.exports = function( options ){
  return Object.create( utils.extend({
    options:  utils.defaults( options || {}, {
                immutable: true
              })

  , map:      {}
  }, Graph.proto ) );
};

module.exports.proto = {
  add: function( id, data ){
    var g = this.instance();

    g.map[ id ] = Vertex( id, data, this.options );

    return g;
  }

, get: function( id ){
    return this.map[ id ];
  }

, remove: function( id ){
    var g = this.instance();
    var v = g.map[ id ];
    
    // Remove edges
    for ( var outgoingId in v.outgoing ){
      delete v.outgoing[ outgoingId ].incoming[ id ];
    }

    for ( var incomingId in v.incoming ){
      delete v.incoming[ incomingId ].outgoing[ id ];
    }
    
    delete g.map[ id ];

    return g;
  }

, connect: function( a, b ){
    var g = this.instance();

    if ( !this.contains( a ) ){
      throw new Error('Invalid first argument: Missing vertex');
    }

    if ( !this.contains( b ) ){
      throw new Error('Invalid second argument: Missing vertex');
    }

    g.map[ a ].outgoing[ b ] = g.map[ b ];
    g.map[ b ].incoming[ a ] = g.map[ a ];

    return g;
  }

, contains: function( id ){
    if ( typeof id === 'string' ){
      return id in this.map;
    }

    return Object
      .keys( this.map )
      .some( function( k ){
        return k === id;
      });
  }

, instance: function(){
    return this.options.immutable ? this.clone() : this;
  }

, clone: function(){
    var g = Object
      .keys( this.map )
      .reduce( function( g, id ){
        var k;
        var v = g.map[ id ] = this.map[ id ].clone();

        return g;
      }.bind( this ), Graph( this.options ) );

    // Ensure the references to incoming/outgoing are to
    // the newly cloned values
    return Object
      .keys( g.map )
      .reduce( function( g, id ){
        var v = g.map[ id ];

        for ( var incomingId in v.incoming ){
          v.incoming[ incomingId ] = g.map[ incomingId ];
        }

        for ( var outgoingId in v.outgoing ){
          v.outgoing[ outgoingId ] = g.map[ outgoingId ];
        }

        return g;
      }, g );
  }
};