require('lodash').extend( module.exports, require('lodash') );

/**
 * Retrieve an arbitrary key from the obj
 * @param  {Object} obj The object to fetch the key from
 * @return {String}     The fetched key
 */ 
module.exports.someKey = function( obj ){
  for ( var k in obj ){
    return k;
  }
}