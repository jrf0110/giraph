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
  , incoming: {}
  , outgoing: {}
  });
};

Vertex.proto = {
  'clone': {
    enumerable: false
  , value: function(){
      var v = Vertex( this.id, utils.cloneDeep( this.data ) );

      utils.extend( v.incoming, this.incoming );
      utils.extend( v.outgoing, this.outgoing );

      return v;
    }
  }

// , 'instance': {
//     enumerable: false
//   , value: function(){
//       return this.options.immutable ? this.clone() : this;
//     }
//   }

// , 'del': {
//     enumerable: false
//   , value: function(){
//       var k, v = this;

//       for ( k in this.incoming ){
//         delete incoming[ k ].outgoing[ this.id ];
//       }

//       for ( k in outgoing ){
        
//       }
//     }
//   }

// , 'connect': {
//     enumerable: false
//   , value: function( vb ){
//       var this_ = this.instance();
//       this_.outgoing[ vb.id ] = vb;
//       vb.incoming[ this_.id ] = this_;
//       return this_;
//     }
//   }
};