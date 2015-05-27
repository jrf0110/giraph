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
  });
};

Vertex.proto = {
  'clone': {
    enumerable: false
  , value: function(){
      var v = Vertex( this.id, utils.cloneDeep( this.data ) );

      utils.extend( v.edges, this.edges );

      return v;
    }
  }
};