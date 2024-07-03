# Autonomous Mail Delivery Trains

> **Note:** This project is still a Work In Progress.

## Introduction

In the modern era of logistics and transportation, the efficiency and automation of delivery systems are paramount. This project presents a solution to a complex problem involving a network of autonomous mail delivery trains. The system is designed to ensure that all packages are delivered to their respective destinations using a network of trains that navigate through a series of nodes connected by edges.

## Problem Overview

The core challenge involves controlling a network of autonomous trains to deliver packages across a predefined network. The network consists of nodes (stations), edges (tracks connecting stations), trains, and packages. The objective is to move all packages to their destination nodes in the most efficient manner possible.

### Key Components

- **Nodes**: Stations within the network, each identified by a unique name.
- **Edges**: Tracks that connect two nodes, with an associated journey time in minutes. These are undirected and can accommodate any number of trains.
- **Trains**: Vehicles within the network, each with a maximum weight capacity and a starting node.
- **Packages**: Items to be delivered, each with a weight, a starting node, and a destination node.

### Input

The program takes the following inputs:

- A list of node names: `[Node1, Node2, ...]`
- A list of edges: `(EdgeName, Node1, Node2, JourneyTimeInMinutes)`
- A list of trains: `(TrainName, CapacityInKg, StartingNode)`
- A list of packages: `(PackageName, WeightInKg, StartingNode, DestinationNode)`

### Output

The output is a list of moves, where each move includes:

- Time of the move in seconds (`W`)
- Name of the train making the move (`T`)
- Starting node (`N1`)
- Names of packages picked up at the start node (`P1`)
- Destination node (`N2`)
- Names of packages dropped off at the destination node (`P2`)

### Constraints

- Trains cannot exceed their weight capacity.
- There must be a direct edge between the start and destination nodes for a move.
- Trains travel at the journey time specified for each edge.
- Trains can start their next move only from their current node.
- Nodes and edges can accommodate any number of trains simultaneously.

## Current Limitations

Currently, the solution is optimised to find the best path for a specific package rather than handling the entire list of packages simultaneously. This limitation is primarily due to the complexity involved in optimising routes for multiple packages, considering their various starting points and destinations within the network.

## Solution Approach

The solution to this problem can be approached using graph theory algorithms, specifically focusing on shortest path.

### Comparison of Dijkstra's Algorithm and Floyd-Warshall Algorithm

- **Dijkstra's Algorithm** is particularly efficient for finding the shortest path from a single source node to all other nodes in a graph with non-negative edge weights. It is more suitable for scenarios where the starting point is fixed, and we need to find the shortest paths to various destinations. The implementation can be found in `dijkstrasSolution.ts`.

- **Floyd-Warshall Algorithm**, on the other hand, is used to find the shortest paths between all pairs of nodes in a weighted graph. This algorithm is beneficial when we need to precompute the shortest paths between all nodes, allowing for dynamic decision-making as packages are picked up and delivered. The implementation can be found in `floydWarshallSolution.ts`.

## Quick Start Guide

To get started with a basic implementation of this system, follow the steps below:

```shell
# Install dependencies
npm install

# Start the program
npm start

# To run tests
npm test
```

### Output

```shell
-----------------
Dijkstras Solution
-----------------

Time taken to add route: 0.023750000000063665ms

Move train Q4 from station D to station A via route E2. Takes 10 minutes. W: 0, T: Q4, N1: D, P1: [], N2: A, P2: []
Move train Q4 from station A to station D via route E2. Takes 10 minutes. W: 10, T: Q4, N1: A, P1: [K1], N2: D, P2: []
Move train Q4 from station D to station E via route E6. Takes 2 minutes. W: 20, T: Q4, N1: D, P1: [], N2: E, P2: []
Move train Q4 from station E to station C via route E7. Takes 1 minutes. W: 22, T: Q4, N1: E, P1: [], N2: C, P2: [K1]

Time taken: 0.7689589999999953ms



-----------------------
Floyd Warshall Solution
-----------------------

Time taken to add route: 0.2030409999999847ms

Move train Q4 from station D to station A via route E2. Takes 10 minutes. W: 0, T: Q4, N1: D, P1: [], N2: A, P2: []
Move train Q4 from station A to station D via route E2. Takes 10 minutes. W: 10, T: Q4, N1: A, P1: [K1], N2: D, P2: []
Move train Q4 from station D to station E via route E6. Takes 2 minutes. W: 20, T: Q4, N1: D, P1: [], N2: E, P2: []
Move train Q4 from station E to station C via route E7. Takes 1 minutes. W: 22, T: Q4, N1: E, P1: [], N2: C, P2: [K1]

Time taken: 0.3353749999999991ms
```

## Conclusion

The implementation of Dijkstra's Algorithm and Floyd-Warshall Algorithm showcases their effectiveness in addressing the autonomous mail delivery trains problem. Both algorithms enable the system to navigate efficiently through a network, optimising routes for package delivery.

Dijkstra's Algorithm is more efficient for scenarios with a single source and multiple destinations, making it faster for route addition but slower in overall solution retrieval. In contrast, the Floyd-Warshall Algorithm, designed for finding shortest paths between all node pairs, takes longer to add routes due to its comprehensive precomputation but offers quicker access to the final results.

This comparative analysis highlights the strengths and situational advantages of each algorithm within the context of autonomous mail delivery systems.

## Future Work

Future enhancements will focus on overcoming the current limitation of handling a single package at a time. The goal is to enable the system to optimise routes and load balancing for all packages simultaneously, thereby fully addressing the problem overview.

In addition to the current algorithms, further research will be conducted on the applicability and efficiency of other graph algorithms, including:

- **A\* Algorithm**: To explore its potential in optimising pathfinding with heuristics, which could significantly reduce the search space and improve efficiency in route planning.
- **Cycle Detection Algorithm**: To ensure the robustness of the network by identifying and preventing potential loops that could disrupt the delivery process.
- **Maximum Flow Algorithm**: To maximise the throughput of packages through the network, ensuring that all resources are utilised optimally and that the delivery capacity is maximised.

These algorithms offer promising avenues for enhancing the system's capabilities, addressing complex challenges in logistics, and further optimising the autonomous mail delivery trains' performance.

## References

- Graph Theory: https://en.wikipedia.org/wiki/Graph_theory
- Dijkstra's Algorithm: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
- Floyd-Warshall Algorithm: https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
