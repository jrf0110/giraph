var utils = require('./utils');

var Vertex = module.exports = function( id, data, options ){
  var v = {};

  Object.defineProperty( v, 'options', {
    enumerable: false
  , value:  utils.defaults( options || {}, {
              immutable: true
            })
  });

  Object.defineProperties( v, Vertex.proto );

  return utils.extend( Object.create( v ), {
    id:       id
  , data:     data
  , edges:    {}
  , incoming: []
  , outgoing: []
  });
};

Vertex.proto = {
  '__type': {
    enumerable: false
  , value: 'Vertex'
  }

, 'clone': {
    enumerable: false
  , value: function( options ){
      options = options || {};

      var v = Vertex( this.id, utils.cloneDeep( this.data ) );

      if ( options.skipEdges !== true ){
        utils.extend( v.edges, this.edges );
      }

      if ( this.incoming.length > 0 ){
        v.incoming = this.incoming.slice(0);
      }

      if ( this.outgoing.length > 0 ){
        v.outgoing = this.outgoing.slice(0);
      }

      return v;
    }
  }
};