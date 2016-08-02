'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 *  Author: Austin Steeno
 *  Email: austin.steeno@gmail.com
 *  Twitter: @EndainGaming
 *  ---------------------------------------------------------------------------
 *  This file contains the implementation of a Graph class used for creating
 *  a graph data model and running various algorithms on it.
 *
 */


// ============================================================================
// Implementation of a Graph data strudcture
function Graph() {
    this.init();
};

// ----------------------------------------------------------------------------
// Define methods for Graph class

// Function to initialize a graph
Graph.prototype.init = function () {
    // Keep internal lists of nodes and edges
    this._nodes = [];
    this._edges = [];

    // Track some statistics
    this._addedNodes = 0;
    this._addedEdges = 0;
    this._removedNodes = 0;
    this._removedEdges = 0;

    // Internal id generators
    this._nodeIds = 0;
    this._edgeIds = 0;

    // Graph configuration options
    this._suppressEvents = false;
}

// Function to add a node to the graph
Graph.prototype.addNode = function () {
    // Create a new node
    var node = new GraphNode( this, this._nodeIds++, this._nodes.length );

    // Add this node to the internal array store
    this._nodes.push( node );

    // Increment internal counter
    this._addedNodes++;

    if( !this._suppressEvents )
        this.trigger( 'nodeadded', node );

    // Return the new node
    return node;
}

// Function to add an edge to the graph
Graph.prototype.addEdge = function ( from, to ) {
    // Validate the inputs are nodes
    if( this._isNode( from ) && this._isNode( to ) ) {
        // Create a new edge
        var edge = new GraphEdge( this, this._edgeIds++, from, to, this._edges.length );

        // Add this edge to the internal array store
        this._edges.push( edge );

        // Increment internal counter
        this._addedEdges++;

        this.trigger( 'edgeadded', edge );

        // Return the new edge
        return edge;
    }

    // Return false if could not add
    return false;
}

// Function to remove a node
Graph.prototype.removeNode = function ( node ) {
    // Only remove if input is valid
    if( this._isNode( node ) ) {
        // Get a node to swap with
        var replacement = this._nodes.pop();

        // If replacement === node, then we are done, this was the last node
        if( replacement !== node ) {
            // Remove from the internal array
            replacement._index = node._index;
            this._nodes[ replacement._index ] = replacement;
        }

        // Also remove all connected edges
        for( var i = 0; i < node._edges.length; i++ )
            this.removeEdge( node._edges[ i ] );

        // Increment internal counter
        this._removedNodes++;

        // Trigger removed node event
        if( !this._suppressEvents )
            this.trigger( 'noderemoved', node );
    }

    // Return false if could not remove
    return false;
}

// Function to remove an edge
Graph.prototype.removeEdge = function ( edge ) {
    // Only remove if input is valid
    if( this._isEdge( edge ) ) {
        // Get an edge to swap with
        var replacement = this._edges.pop();

        // If replacement === edge, then we are done, this was the last edge
        if( replacement !== edge ) {
            // Remove from the internal array
            replacement._index = node._index;
            this._edges[ replacement._index ] = replacement;
        }

        // Remove the edge from the nodes its attached to as well
        edge._from._disconnectEdge( edge );
        edge._to._disconnectEdge( edge );

        // Increment internal counter
        this._removedEdges++;

        this.trigger( 'edgeremoved', edge );
    }

    // Return false if could not remove
    return false;
}

// Function to get a nodes
Graph.prototype.nodes = function () {
    return this._nodes;
}

// Function to get an edges
Graph.prototype.edges = function () {
    return this._edges;
}

// Function to get a count of the current nodes
Graph.prototype.totalNodes = function () {
    return this._nodes.length;
}

// Function to get a count of the current edges
Graph.prototype.totalEdges = function () {
    return this._edges.length;
}

// ----------------------------------------------------------------------------
// Define internal methods for Graph class

// Function to validate if the input if a GraphNode (Node)
Graph.prototype._isNode = function ( node ) {
    if( node && node instanceof GraphNode && node._graph === this )
        return true;
    return false;
}

// Function to validate if the input if a GraphEdge (Edge)
Graph.prototype._isEdge = function ( edge ) {
    if( edge && edge instanceof GraphEdge && edge._graph === this )
        return true;
    return false;
}

// ----------------------------------------------------------------------------
// Mixin event support
MicroEvent.mixin( Graph );

/*
 *  Author: Austin Steeno
 *  Email: austin.steeno@gmail.com
 *  Twitter: @EndainGaming
 *  ---------------------------------------------------------------------------
 *  This file contains the implementation of a Node class used by the Graph
 *  class to represent nodes.
 *
 */


// ============================================================================
// Implementation of a Node data strudcture
function GraphNode$1( graph, id, index ) {
    this.init( graph, id, index );
};

// ----------------------------------------------------------------------------
// Define methods for Node class

// Function to initialize a node
GraphNode$1.prototype.init = function ( graph, id, index ) {
    // Keep the graph this node is associated with
    this._graph = graph;

    // Keep the id given for the node
    this._id = id;

    // Keep the index for the node
    this._index = index;

    // Set up data and property container
    this._properties = {};

    // Set up array of associated edges
    this._edges = [];
}

// Function to get the node ID
GraphNode$1.prototype.id = function () {
    return this._id;
}

// Function to get the graph this node belongs to
GraphNode$1.prototype.graph = function () {
    return this._graph;
}

// Function to get or set a node property
GraphNode$1.prototype.property = function ( name, value ) {
    if( name !== undefined ) {
        if( value !== undefined )
            this._properties[ name ] = value;
        return this._properties[ name ];
    }

    return undefined;
}

// ----------------------------------------------------------------------------
// Define internal/private methods for Graph class

// Function to connect an edge to the node
GraphNode$1.prototype._connectEdge = function ( edge ) {
    // Set the edge index
    if( edge._from === this )
        edge._fromIndex = this._edges.length;
    else
        edge._toIndex = this._edges.length;

    // Append the edge
    this._edges.push( edge );
}

// Function to disconnect an edge to the node
GraphNode$1.prototype._disconnectEdge = function ( edge ) {
    // Get a node to swap with
    var replacement = this._edges.pop();

    // If replacement === edge, then we are done, this was the last edge
    if( replacement === edge )
        return;

    // Figure out the index we are replacing
    var index = ( edge._from === this ) ? edge._fromIndex : edge._toIndex;

    // Figure out if the replacement is the to or from node
    if( replacement._from === this ) {
        // Remove from the internal array
        replacement._fromIndex = index;
        this._edges[ index ] = replacement;
    } else {
        // Remove from the internal array
        replacement._toIndex = index;
        this._edges[ index ] = replacement;
    }
}

/*
 *  Author: Austin Steeno
 *  Email: austin.steeno@gmail.com
 *  Twitter: @EndainGaming
 *  ---------------------------------------------------------------------------
 *  This file contains the implementation of an Edge class used by the Graph
 *  class to represent edges.
 *
 */


// ============================================================================
// Implementation of a Edge data strudcture
function GraphEdge$1( graph, id, from, to, index ) {
    this.init( graph, id, from, to, index );
};

// ----------------------------------------------------------------------------
// Define methods for Graph class

// Function to initialize an edge
GraphEdge$1.prototype.init = function ( graph, id, from, to, index ) {
    // Keep the graph this node is associated with
    this._graph = graph;

    // Keep the id given for the edge
    this._id = id;

    // Keep the index for the edge
    this._index = index;

    // Keep to/from node references
    this._from = from;
    this._to = to;

    // Set up property container
    this._properties = {};

    // Connect to the source and target node
    from._connectEdge( this );
    to._connectEdge( this );
}

// Function to get the node ID
GraphEdge$1.prototype.id = function () {
    return this._id;
}

// Function to get the graph this node belongs to
GraphEdge$1.prototype.graph = function () {
    return this._graph;
}

// Function to get the from node
GraphEdge$1.prototype.from = function () {
    return this._from;
}

// Function to get the to node
GraphEdge$1.prototype.to = function () {
    return this._to;
}

// Function to get or set an edge property
GraphEdge$1.prototype.property = function ( name, value ) {
    if( name !== undefined ) {
        if( value !== undefined )
            this._properties[ name ] = value;
        return this._properties[ name ];
    }

    return undefined;
}

exports.Graph = Graph;
exports.Node = GraphNode$1;
exports.Edge = GraphEdge$1;