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
* [Directed Graph](#directed-graph)
* [Directed Acyclic Graph](#directed-acyclic-graph)

### Undirected Graph

Exported as a factory function on the root namespace:

#### `.([options])

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

##### `.add( id[, data] )`

__Returns__ a new instance with [Vertex(id[, data])](#vertex) added to it.

##### `.get( id )`

Gets the [Vertex](#vertex) at `id`.

##### `.remove( id )`

__Returns__ a new instance with `id` removed.

##### `.connect( a, b, edgeWeight )`

__Returns__ a new instance with `a` and `b` connected.

##### `.contains( String|Vertex id )`

__Returns__ a boolean indicating whether or not `id` is in the graph.

_Note: if passing in a String, is equivalent to checking `id in graph.map`._

##### `.instance()`

__Returns__ `this` instance or a `clone()` depending on `options.immutable`.

##### `.clone()`

__Returns__ a new instance of the graph

##### `.mutate(handler)`

Allows mutation to occur on an immutable graph for a single turn of the event loop.

__Returns__ the original instance

```javascript
require('giraph')()
  .mutate(function( g ){
    // Batch operations here
    g.add('a').add('b').add('c');
  })
```

### Directed Graph

TODO

### Directed Acyclic Graph

TODO