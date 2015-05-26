var assert = require('assert');
var giraph = require('../');

describe('Giraph', function(){
  describe('() - Graph', function(){
    var graph = giraph();

    it('.clone()', function(){
      var g1 = graph.clone();
      g1.map.a = 'blah';
      assert.equal( graph.map.a, undefined );
    });

    it('.contains(id)', function(){
      assert( graph.add('a').contains('a') );
      assert( !graph.add('b').contains('a') );
    });

    it('.add(id, data) should add a vertex', function(){
      var g1 = graph
        .add('a')
        .add('b');

      assert.equal( g1.map.a.id, 'a' );
      assert.equal( g1.map.b.id, 'b' );

      // Ensure immutability
      assert.equal( graph.map.a, undefined, 'immutability test failed' );
      assert.equal( graph.map.b, undefined, 'immutability test failed' );
    });

    it('.remove(id)', function(){
      assert.equal(
        graph.add('a').remove('a').get('a'), undefined
      );

      var g = graph
        .add('a')
        .add('b')
        .add('c')
        .add('d')
        .connect('a', 'b')
        .connect('a', 'd')
        .connect('d', 'a')
        .connect('b', 'c')
        .connect('b', 'd')
        .connect('c', 'd')
        .remove('a');

      assert.equal( g.map.a, undefined );
      assert.equal( g.map.d.incoming.a, undefined );
      assert.equal( g.map.d.outgoing.a, undefined );
    });

    it('general immutability', function(){
      var g1 = giraph().add('a').add('b').connect('a', 'b');
      var g2 = g1.clone();

      g1.get('b').data = 'poop';
      g2.get('b').data = 'not-poop';

      assert.notEqual( g1.get('b').data, g2.get('b').data );
    });
  });

  describe('.dg() - Directed Graph', function(){

  });

  describe('.dag() - Directed Acyclic Graph', function(){

  });

  describe('Vertex', function(){
    it('.clone() clones fields', function(){
      var v = giraph.vertex('a', 'value');
      assert.equal( v.id, 'a' );
      assert.equal( v.data, 'value' );

      var vc = v.clone();
      assert.equal( v.id, vc.id );
      assert.equal( v.data, vc.data );
    });

    it('.clone() - clones values', function(){
      var v = giraph.vertex('a', { my: 'obj' });
      var vc = v.clone();
      assert.notEqual( v.data, vc.data );
    });

    // it('.connect(vertex b) - connects to vertices', function(){
    //   var va = giraph.vertex('a');
    //   var vb = giraph.vertex('b');

    //   var vbconnected = vb.connect( va );

    //   // Assert immutability
    //   assert( vb !== vbconnected );
    //   assert.equal( vb.outgoing.a, undefined );

    //   assert( vbconnected.outgoing.a === va );
    //   assert( va.incoming.b === vbconnected );
    // });

    // it('.del() - cleans up paths', function(){
    //   var va = giraph.vertex('a');
    //   var vb = giraph.vertex('b').connect( va );

    //   assert( vbconnected.outgoing.a === va );
    //   assert( va.incoming.b === vbconnected );

    //   va.del();

    //   assert( vbconnected.outgoing.a === undefined );
    //   assert( va.incoming.b === undefined );

    //   assert.eq
    // });
  });
});