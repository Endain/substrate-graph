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
function GraphNode( graph, id, index ) {
    this.init( graph, id, index );
};

// ----------------------------------------------------------------------------
// Define methods for Node class

// Function to initialize a node
GraphNode.prototype.init = function ( graph, id, index ) {
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
GraphNode.prototype.id = function () {
    return this._id;
}

// Function to get the graph this node belongs to
GraphNode.prototype.graph = function () {
    return this._graph;
}

// Function to get or set a node property
GraphNode.prototype.property = function ( name, value ) {
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
GraphNode.prototype._connectEdge = function ( edge ) {
    // Set the edge index
    if( edge._from === this )
        edge._fromIndex = this._edges.length;
    else
        edge._toIndex = this._edges.length;

    // Append the edge
    this._edges.push( edge );
}

// Function to disconnect an edge to the node
GraphNode.prototype._disconnectEdge = function ( edge ) {
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

// ----------------------------------------------------------------------------
// Export graph class
export default GraphNode;
