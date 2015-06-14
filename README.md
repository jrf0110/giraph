# Giraph

> Immutable graph data structures

![Giraph](http://storage.j0.hn/giraph-1.png)

__Install__

```
npm install -S giraph
bower install -S giraph
```

__Usage__

```javascript
require('giraph')()
  .add('a', { my: 'data' })
  .add('b')
  .add('c')
  .connect('a', 'b', 3)
  .connect('a', 'c')
```

## Docs

Giraph comes with a number of different graph types:

* [Undirected Graph](#undirected-graph)
* [Directed Graph (Not Implemented Yet)](#directed-graph)
* [Directed Acyclic Graph (Not Implemented Yet)](#directed-acyclic-graph)

### Undirected Graph

Exported as a factory function on the root namespace:

#### `.([options])`

__Options and defaults__

```javascript
{
  immutable: true
}
```

```javascript
require('giraph')() // => empty graph
```

The undirected graph has the following members

#### Property: `.map: {}`

Hashes vertices by id.

#### Property: `.options`

Instance options

#### Property: `.length`

The number of vertices

#### `.add( id[, data] )`

__Returns__ a new instance with [Vertex(id[, data])](#vertex) added to it.

#### `.get( id )`

Gets the [Vertex](#vertex) at `id`.

#### `.remove( id )`

__Returns__ a new instance with `id` removed.

#### `.connect( a, b, edgeWeight )`

__Returns__ a new instance with `a` and `b` connected.

#### `.contains( String|Vertex id )`

__Returns__ a boolean indicating whether or not `id` is in the graph.

_Note: if passing in a String, is equivalent to checking `id in graph.map`._

#### `.merge( a[, b[, ...]] )`

__Returns__ a new instance with all other graphs merged into the current.

_Note: merging takes Left-to-right precedence. If `a` and `b` both contain the same node, `c`, but have different data attached, `b` will take precedence._

__Example:__

```javascript
var g1 = giraph()
  .add('a')
  .add('b', { some: 'thing' })
  .connect('a', 'b', 1);

var g2 = giraph()
 .add('b', { some: 'data' })
 .add('c')
```

#### `.each( Function iterator )`

Iterates through each vertex. The `iterator` argument has the following signature:

```
function( Vertex v, Number i, Graph g )
```

__Example__:

```javascript
require('giraph')
  .add('a', { some: 'data' }).add('b').add('c')
  .each( function( vertex, i, graph ){
    console.log( vertex.id, vertex.data, i );
  });
  
  // a { some: 'data' }
  // b null
  // c null
```

__Returns__ `this`

#### `.reduce( Function iterator, Mixed initialValue )`

Iterates through the graph, producing a single value. `iterator` has the following signature

```
function( Mixed currentValue, Vertex V, Number i, Graph g )
```

__Returns__ Value of reduction

#### `.instance()`

__Returns__ `this` instance or a `clone()` depending on `options.immutable`.

#### `.edges([id])`

__Returns__ an array of edges with the following structure:

```javascript
{ vertices: ['a', 'b'], weight: 10 }
```

_Optionally_, pass a vertex ID to only get edges touching that vertex.

#### `.clone()`

__Returns__ a new instance of the graph

#### `.weight()`

__Returns__ The total weight of all edges in the graph

#### `.mutate(handler)`

Allows mutation to occur on an immutable graph for a single turn of the event loop.

__Returns__ the original instance

```javascript
require('giraph')()
  .mutate(function( g ){
    // Batch operations here
    g.add('a').add('b').add('c');
  })
```

#### `.mst()`

__Returns__ a [Minimum Spanning Tree](https://www.wikiwand.com/en/MST) represented as a `Graph`.

### Directed Graph

TODO

### Directed Acyclic Graph

TODO

### Vertex

A vertex is essentially an Identifier with data attached and connections to other vertices.

It's available under `.vertex( id[, data[, options]])`.

#### `.id String`

ID of the vertex

#### `.data Mixed`

Optional attached data

#### `.options Object`

Optional options:

```javascript
{
  immutable: true
}
```

#### `.clone()`

__Returns__ a new instance of the vertex

## TODO

* [Topological Sorting](http://www.wikiwand.com/en/Topological_sorting)
* [Cliques and maximum cliques](https://www.wikiwand.com/en/Clique_(graph_theory))
* [Planarism](https://www.wikiwand.com/en/Planar_graph)
* Creating sub-graphs and walks
