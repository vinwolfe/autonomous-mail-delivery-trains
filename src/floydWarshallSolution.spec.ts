import { FloydWarshallSolution } from './floydWarshallSolution';
import { errors } from './constants';

describe('Solution', () => {
  let solution: FloydWarshallSolution;

  beforeEach(() => {
    solution = new FloydWarshallSolution();
  });

  it('should add stations correctly', () => {
    solution.addStation('A');
    solution.addStation('B');
    expect(solution.adjacencyList).toHaveProperty('A');
    expect(solution.adjacencyList).toHaveProperty('B');
  });

  it('should throw error if adding route with non-existent station', () => {
    expect(() => solution.addRoute('Route1', 'A', 'B', 10)).toThrow(errors.stationDoesNotExist);
  });

  it('should add routes correctly', () => {
    solution.addStation('A');
    solution.addStation('B');
    solution.addRoute('Route1', 'A', 'B', 10);
    expect(solution.adjacencyList['A']).toEqual([{ name: 'Route1', station: 'B', timeInMinutes: 10 }]);
    expect(solution.adjacencyList['B']).toEqual([{ name: 'Route1', station: 'A', timeInMinutes: 10 }]);
  });

  it('should throw error if adding train with non-existent starting station', () => {
    expect(() => solution.addTrain('Train1', 1000, 'A')).toThrow(errors.stationDoesNotExist);
  });

  it('should add trains correctly', () => {
    solution.addStation('A');
    solution.addTrain('Train1', 1000, 'A');
    expect(solution.trains).toHaveProperty('Train1');
    expect(solution.trains['Train1']).toEqual({ name: 'Train1', capacityInKg: 1000, startingStation: 'A' });
  });

  it('should add packages correctly', () => {
    solution.addPackage('Package1', 500, 'A', 'B');
    expect(solution.packages).toHaveProperty('Package1');
    expect(solution.packages['Package1']).toEqual({ name: 'Package1', weightInKg: 500, startingStation: 'A', destinationStation: 'B' });
  });

  it('should calculate solution correctly', () => {
    solution.addStation('A');
    solution.addStation('B');
    solution.addStation('C');
    solution.addStation('D');
    solution.addStation('E');
    
    // Add routes
    solution.addRoute('R1', 'A', 'B', 2);
    solution.addRoute('R2', 'A', 'E', 5);
    solution.addRoute('R3', 'B', 'C', 3);
    solution.addRoute('R4', 'B', 'E', 4);
    solution.addRoute('R5', 'C', 'D', 1);
    solution.addRoute('R6', 'C', 'E', 10);

    // Add trains
    solution.addTrain('T1', 4, 'E');

    // Add packages
    solution.addPackage('P1', 1, 'A', 'D');

    // Calculate solution
    const result = solution.calculateSolutionForPackage('P1');
    expect(result).toEqual({
      "T1": {
        path: [
          { summary: "Move train T1 from station E to station A via route R2. Takes 5 minutes.", W: 0, T: "T1", N1: "E", P1: [], N2: "A", P2: []},
          { summary: "Move train T1 from station A to station B via route R1. Takes 2 minutes.", W: 5, T: "T1", N1: "A", P1: ["P1"], N2: "B", P2: []},
          { summary: "Move train T1 from station B to station C via route R3. Takes 3 minutes.", W: 7, T: "T1", N1: "B", P1: [], N2: "C", P2: []},
          { summary: "Move train T1 from station C to station D via route R5. Takes 1 minutes.", W: 10, T: "T1", N1: "C", P1: [], N2: "D", P2: ["P1"]},
        ],
        totalTime: 11
      }
    })
  });

  it('should precompute all paths correctly', () => {
    solution.addStation('A');
    solution.addStation('B');
    solution.addStation('C');
    solution.addRoute('Route1', 'A', 'B', 5);
    solution.addRoute('Route2', 'B', 'C', 5);
    solution.precomputeAllPaths();
    expect(solution.shortestPaths['A']['C'].totalTime).toBe(10);
    expect(solution.shortestPaths['A']['C'].path).toEqual(['A', 'B', 'C']);
  });
});