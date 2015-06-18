var assert = require('assert');
var giraph = require('../');

describe('Giraph', function(){
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

    it('.clone() - clones incoming/outgoing', function(){
      var v = giraph.vertex('a', { my: 'obj' });

      v.incoming.push('b');
      v.outgoing.push('c');

      var vc = v.clone();
      assert.notEqual( v.incoming, vc.incoming );
      assert.notEqual( v.outgoing, vc.outgoing );
    });
  });
  
  describe('() - Graph', function(){
    var graph = giraph();

    it('.clone()', function(){
      assert.notEqual( graph.clone().map, graph.map );

      var g1 = graph
        .add('a')
        .add('b')
        .connect('a', 'b', 2)
        .clone();

      assert.deepEqual( g1.map, {
        a: { id: 'a', edges: { b: 2 }, data: undefined, incoming: [], outgoing: [] }
      , b: { id: 'b', edges: { a: 2 }, data: undefined, incoming: [], outgoing: [] }
      });
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
      assert.equal( g1.length, 2 );

      // Ensure immutability
      assert.equal( graph.map.a, undefined, 'immutability test failed' );
      assert.equal( graph.map.b, undefined, 'immutability test failed' );
    });

    it('.connect(a,b)', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .connect('a', 'b');

      assert.deepEqual( g1.get('a').edges, {
        b: undefined
      });

      assert.deepEqual( g1.get('b').edges, {
        a: undefined
      });
    });

    it('.connect(a,b,[weight])', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b', 3)
        .connect('a', 'c', 4);

      assert.deepEqual( g1.get('a').edges, {
        b: 3
      , c: 4
      });

      assert.deepEqual( g1.get('b').edges, {
        a: 3
      });

      assert.deepEqual( g1.get('c').edges, {
        a: 4
      });
    });

    it('.edges()', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b', 3)
        .connect('a', 'c', 4)
        .connect('b', 'c', 2);

      assert.deepEqual( g1.edges(), [
        { vertices: ['a', 'b'], weight: 3 }
      , { vertices: ['a', 'c'], weight: 4 }
      , { vertices: ['b', 'c'], weight: 2 }
      ]);
    });

    it('.edges(id)', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b', 3)
        .connect('a', 'c', 4)
        .connect('b', 'c', 2);

      assert.deepEqual( g1.edges('a'), [
        { vertices: ['a', 'b'], weight: 3 }
      , { vertices: ['a', 'c'], weight: 4 }
      ]);
    });

    it('.weight()', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b', 3)
        .connect('a', 'c', 4);

      assert.equal( g1.weight(), 7 );
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
      assert.equal( g.map.d.edges.a, undefined );
      assert.equal( g.map.d.edges.a, undefined );
    });

    it('general immutability', function(){
      var g1 = giraph().add('a').add('b').connect('a', 'b');
      var g2 = g1.clone();

      g1.get('b').data = 'poop';
      g2.get('b').data = 'not-poop';

      assert.notEqual( g1.get('b').data, g2.get('b').data );
    });

    it('.mutate(handler)', function(){
      var g1 = graph
        .clone()
        .mutate(function( g2 ){
          g2.add('a')
            .add('b')
            .connect('a', 'b');
        });

      assert.deepEqual( g1.get('a').edges, {
        b: undefined
      });

      assert.deepEqual( g1.get('b').edges, {
        a: undefined
      });
    });

    it('.merge(a, b)', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b')
        .connect('b', 'c');

      var g2 = graph
        .add('b')
        .add('c')
        .add('d')
        .connect('b', 'c')
        .connect('c', 'd')
        .connect('d', 'b');

      var expected = g2
        .add('a')
        .add('b')
        .add('c')
        .add('d')
        .connect('a', 'b')
        .connect('b', 'c')
        .connect('c', 'd')
        .connect('d', 'b');

      var merged = g1.merge( g2 );

      assert.deepEqual(
        merged.map
      , expected.map
      );

      assert.equal( merged.weight, expected.weight );
    });

    it('.merge(a[, b, ...]', function(){
      var g1 = graph
        .add('a')
        .add('b')
        .add('c')
        .connect('a', 'b')
        .connect('b', 'c');

      var g2 = graph
        .add('b')
        .add('c')
        .add('d')
        .add('e')
        .connect('b', 'c')
        .connect('c', 'd')
        .connect('d', 'b')
        .connect('c', 'e');

      var g3 = graph
        .add('e')
        .add('f')
        .connect('e', 'f');

      var expected = g2
        .add('a')
        .add('e')
        .add('f')
        .connect('a', 'b')
        .connect('b', 'c')
        .connect('c', 'e')
        .connect('e', 'f');

      var merged = g1.merge( g2, g3 );

      assert.deepEqual(
        merged.map
      , expected.map
      );
    });

    it('.mst()', function(){
      var solution = Array.apply( null, Array(10) )
        .map( function( x, i ){
          return 'abcdefghij'[i];
        })
        .reduce( function( g, letter ){
          return g.add( letter );
        }, graph )
        .connect('a', 'b', 3)
        .connect('b', 'c', 2)
        .connect('c', 'd', 2)
        .connect('c', 'e', 8)
        .connect('e', 'f', 8)
        .connect('e', 'g', 7)
        .connect('g', 'h', 4)
        .connect('h', 'i', 1)
        .connect('i', 'j', 3);

      var g1 = solution
        .connect('a', 'd', 6)
        .connect('a', 'f', 9)
        .connect('b', 'd', 4)
        .connect('b', 'e', 9)
        .connect('b', 'f', 9)
        .connect('d', 'g', 9)
        .connect('e', 'i', 9)
        .connect('e', 'j', 10)
        .connect('f', 'j', 18)
        .connect('g', 'i', 5)
        .connect('h', 'j', 4);

      var result = g1.mst();

      assert.deepEqual( solution.map, result.map );
    });
  });

  it('.causesCycle( a, b )', function(){
    // var g1 = giraph({ directed: true, acyclic: true })
    //   .add('a')
    //   .add('b');

    // assert.equal( g1.causesCycle('a', 'b'), true );

    // g1 = g1
    //   .add('c')
    //   .add('d')
    //   .add('e')
    //   .connect('a', 'b')
    //   .connect('a', 'c')
    //   .connect('b', 'c')
    //   .connect('c', 'e');

    // assert.equal( g1.causesCycle('e', 'a'), true );
    // assert.equal( g1.causesCycle('a', 'e'), false );
  });

  it('.topologicalSort()', function(){
    var g1 = graph
      .add('a')
      .add('b');
      .add('c')
      .add('d')
      .add('e')
      .connect('a', 'b')
      .connect('a', 'c')
      .connect('b', 'c')
      .connect('c', 'e');

    assert.deepEqual( g1.topologicalSort(), [
      giraph.vertex('d')
    , 
    ]);
  });
});