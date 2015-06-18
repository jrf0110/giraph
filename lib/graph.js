var utils = require('./utils');
var Vertex = require('./vertex');

var Graph = module.exports = function( options ){
  return Object.create( utils.extend({
    options:  utils.defaults( options || {}, {
                immutable:  true
              , directed:   false
              })

  , map:      {}
  }, Graph.proto ) );
};

module.exports.proto = {
  length: 0

, add: function( id, data ){
    if ( id.__type === 'Vertex' ){
      return this.addVertex( id );
    }

    if ( id in this.map ){
      return this;
    }

    var g = this.instance();

    g.map[ id ] = Vertex( id, data, this.options );
    g.length++;

    return g;
  }

, addVertex: function( v ){
    var g = this.instance();

    throw new Error('Not supported');

    // return g;
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

    this.length--;

    return g;
  }

  /**
   * Throws an error if any String arguments passed
   * are not contained in the graph
   */
, validateVertices: function(){
    var i = 0;

    while ( i < arguments.length ){
      if ( !this.contains( arguments[ i++ ] ) ){
        throw new Error('Invalid first argument: Vertex not in Graph');
      }
    }
  }

, connect: function( a, b, edgeWeight ){
    var g = this.instance();

    this.validateVertices( a, b );

    if ( options.acyclic ){
      if ( this.causesCycle( a, b ) ){
        throw new Error('Invalid operation: Adds cycle to graph');
      }
    }

    var oneWay = function( va, vb ){
      g.map[ va ].edges[ vb ] = edgeWeight;

      if ( g.options.directed ){
        if ( va.outgoing.indexOf( b ) === -1 ){
          va.outgoing.push( b );
        }
        
        if ( vb.incoming.indexOf( a ) === -1 ){
          vb.incoming.push( a );
        }
      }
    }.bind( this );

    oneWay( a, b );

    if ( g.options.directed !== true ){
      oneWay( b, a );
    }

    return g;
  }

, contains: function( id ){
    if ( typeof id === 'string' ){
      return id in this.map;
    }

    return Object
      .keys( this.map )
      .some( function( k ){
        return this.map[ k ] === id;
      });
  }

, instance: function(){
    return this.options.immutable ? this.clone() : this;
  }

, clone: function( options ){
    options = options || {};

    var g = Graph( this.options );

    // Add all vertices to the new graph
    g.mutate( function(){
      this.each( function( v ){
        g.add( v.id, v.clone( options ).data );
      });

      // Connect all vertices
      if ( options.skipEdges !== true ){
        this.edges().forEach( function( edge ){
          g.connect( edge.vertices[0], edge.vertices[1], edge.weight );
        }.bind( this ));
      }
    }.bind( this ));

    return g;
  }

, mutate: function( handler ){
    var prev = this.options.immutable;

    this.options.immutable = false;
    handler( this );
    this.options.immutable = prev;

    return this;
  }

, weight: function(){
    return this.edges().reduce( function( weight, edge ){
      return weight + edge.weight;
    }, 0 );
  }

, merge: function(){
    var graphs = Array.prototype.slice.call( arguments );

    return this.instance().mutate( function( g ){
      var onVertex = function( v ){
        g.add( v.id, v.clone().data );
      };

      var onEdge = function( edge ){
        g.connect( edge.vertices[0], edge.vertices[1], edge.weight );
      };

      // For each merge arg
      for ( var i = 0, l = graphs.length, k; i < l; i++ ){
        graphs[ i ]
          // Add all vertices to the instance
          .each( onVertex )
          // Connect all edges to the instance
          .edges()
            .forEach( onEdge );
      }
    });
  }

, each: function( iterator ){
    var i = 0;

    for ( var k in this.map ){
      iterator( this.map[ k ], i++, this );
    }

    return this;
  }

, reduce: function( iterator, val ){
    this.each( function( v, i, g ){
      val = iterator( val, v, i, g );
    });

    return val;
  }

, edges: function( id ){
    var fromId, toId;
    var edges = [];
    var edgesAdded = {};
    var edgeHash;
    var v;

    var map = this.map;

    if ( id ){
      map = {};
      map[ id ] = this.map[ id ];
    }

    for ( fromId in map ){
      v = map[ fromId ];

      for ( toId in v.edges ){
        edgeHash = fromId + ',' + toId;

        if ( edgeHash in edgesAdded ) continue;

        edges.push({
          vertices: [ fromId, toId ]
        , weight: v.edges[ toId ]
        });

        edgesAdded[ edgeHash ] = true;
        edgesAdded[ toId + ',' + fromId ] = true;
      }
    }

    return edges;
  }

  // A bastardization of Prim's algorithm
, mst: function(){
    // This new instance acts as our forest
    return Graph().mutate( function( g ){
      // When determining available edges to choose from,
      // filter to edges that will make a connection
      // between the forest and a node not yet in the forest
      var edgeFilter = function( edge ){
        var a = g.contains( edge.vertices[0] );
        var b = g.contains( edge.vertices[1] );

        return (a || b) && !(a && b);
      };

      // Sort smallest weights last so we can alter the available
      // edges list and get the edge in constant time
      var edgeSort = function( a, b ){
        return b.weight - a.weight;
      };

      var vertexFilter = function( k ){
        return !g.contains( k );
      };

      // Select some random vertex to be in the graph
      var curr = utils.someKey( this.map );

      var edge;
      var availableEdges = this.edges( curr ).sort( edgeSort );
      
      // Initialize the forest with our random vertex
      g.add( curr, this.map[ curr ].clone().data );

      while ( g.length < this.length ){
        edge = availableEdges.pop();

        // From the edge popped, get the vertex that's
        // not currently in the forest
        curr = edge.vertices.filter( vertexFilter )[0];

        g.add( curr );
        g.connect( edge.vertices[0], edge.vertices[1], edge.weight );

        // Add the new edges acquired from adding `curr`
        availableEdges = availableEdges
          .concat( this.edges( curr ) )
          .filter( edgeFilter )
          .sort( edgeSort );
      }
    }.bind( this ));
  }

, topologicalSort: function(){
    if ( !this.options.directed ){
      throw new Error('Cannot topologically sort an undirected graph');
    }

    // Get set of nodes with no edges
    var notDependedOn = [];
    this.each( function( v ){
      if ( v.incoming.length === 0 ){
        notDependedOn.push( v );
      }
    });

    // Perform topological sort on DAG
    var table, node;
    while (table = notDependedOn.pop()){
      ordered.unshift( table );

      // Table has no dependencies, so it doesn't matter where it is
      if (graph[table].outgoing.length == 0) continue;

      // Remove edges from table to dependencies
      while ( graph[table].outgoing.length > 0 ){
        node = graph[table].outgoing.pop();
        graph[node].incoming = graph[node].incoming.filter(function(t){
          return t != table;
        });

        if ( graph[node].incoming.length == 0 ){
          notDependedOn.push( node );
        }
      }
    }

    // Ensure solution was found
    if ( Object.keys( graph ).filter( function( table ){
      return graph[ table ].incoming.length > 0 || graph[ table ].outgoing.length > 0;
    }).length > 0 ) return callback( new Error( 'Dependency tree is cyclic' ));
  }

  // TODO for funsies
// , causesCycle: function( a, b ){

//   }
};
