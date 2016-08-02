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
function GraphEdge( graph, id, from, to, index ) {
    this.init( graph, id, from, to, index );
};

// ----------------------------------------------------------------------------
// Define methods for Graph class

// Function to initialize an edge
GraphEdge.prototype.init = function ( graph, id, from, to, index ) {
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
GraphEdge.prototype.id = function () {
    return this._id;
}

// Function to get the graph this node belongs to
GraphEdge.prototype.graph = function () {
    return this._graph;
}

// Function to get the from node
GraphEdge.prototype.from = function () {
    return this._from;
}

// Function to get the to node
GraphEdge.prototype.to = function () {
    return this._to;
}

// Function to get or set an edge property
GraphEdge.prototype.property = function ( name, value ) {
    if( name !== undefined ) {
        if( value !== undefined )
            this._properties[ name ] = value;
        return this._properties[ name ];
    }

    return undefined;
}

// ----------------------------------------------------------------------------
// Define internal/private methods for Edge class

// ----------------------------------------------------------------------------
// Export Edge class
export default GraphEdge;
