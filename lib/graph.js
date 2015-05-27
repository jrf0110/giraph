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

    if ( !g.contains( id ) ) return g;

    var v = g.map[ id ];
    
    // Remove references from connected vertices
    for ( var connectedId in v.edges ){
      delete g.get( connectedId ).edges[ id ];
    }
    
    delete g.map[ id ];

    return g;
  }

, connect: function( a, b, edgeWeight ){
    var g = this.instance();

    if ( !this.contains( a ) ){
      throw new Error('Invalid first argument: Missing vertex');
    }

    if ( !this.contains( b ) ){
      throw new Error('Invalid second argument: Missing vertex');
    }

    g.map[ a ].edges[ b ] = edgeWeight;
    g.map[ b ].edges[ a ] = edgeWeight;

    return g;
  }

, contains: function( id ){
    if ( typeof id === 'string' ){
      return id in this.map;
    }

    // Not a string? Must be a vertex instance
    return Object
      .keys( this.map )
      .some( function( k ){
        return this.map[ k ] === id;
      });
  }

, instance: function(){
    return this.options.immutable ? this.clone() : this;
  }

, clone: function(){
    return Object
      .keys( this.map )
      .reduce( function( g, id ){
        g.map[ id ] = this.map[ id ].clone();
        return g;
      }.bind( this ), Graph( this.options ) );
  }
};