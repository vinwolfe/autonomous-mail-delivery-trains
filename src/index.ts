import { DijkstrasSolution } from './dijkstrasSolution';
import { FloydWarshallSolution } from './floydWarshallSolution';

console.log(`
-----------------
Dijkstras Solution
-----------------
`);
const ds = new DijkstrasSolution();
ds.addStation('A');
ds.addStation('B');
ds.addStation('C');
ds.addStation('D');
ds.addStation('E');
ds.addStation('F');
const dsPertRoute = performance.now();
ds.addRoute('E1', 'A', 'B', 30);
console.log(`Time taken to add route: ${performance.now() - dsPertRoute}ms\n`);
ds.addRoute('E2', 'A', 'D', 10);
ds.addRoute('E3', 'B', 'C', 10);
ds.addRoute('E4', 'D', 'B', 10);
ds.addRoute('E5', 'D', 'C', 15);
ds.addRoute('E6', 'D', 'E', 2);
ds.addRoute('E7', 'E', 'C', 1);
ds.addTrain('Q1', 6, 'B');
ds.addTrain('Q2', 6, 'C');
ds.addTrain('Q3', 4, 'E');
ds.addTrain('Q4', 7, 'D');
ds.addPackage('K1', 5, 'A', 'C');
const dsPerf = performance.now();
ds.calculateSolutionForPackage('K1');
console.log(`\nTime taken: ${performance.now() - dsPerf}ms`);

console.log(`\n\n\n`);

console.log(`
-----------------------
Floyd Warshall Solution
-----------------------
`);
const fws = new FloydWarshallSolution();
fws.addStation('A');
fws.addStation('B');
fws.addStation('C');
fws.addStation('D');
fws.addStation('E');
fws.addStation('F');
const fwsPertRoute = performance.now();
fws.addRoute('E1', 'A', 'B', 30);
console.log(`Time taken to add route: ${performance.now() - fwsPertRoute}ms\n`);
fws.addRoute('E2', 'A', 'D', 10);
fws.addRoute('E3', 'B', 'C', 10);
fws.addRoute('E4', 'D', 'B', 10);
fws.addRoute('E5', 'D', 'C', 15);
fws.addRoute('E6', 'D', 'E', 2);
fws.addRoute('E7', 'E', 'C', 1);
fws.addTrain('Q1', 6, 'B');
fws.addTrain('Q2', 6, 'C');
fws.addTrain('Q3', 4, 'E');
fws.addTrain('Q4', 7, 'D');
fws.addPackage('K1', 5, 'A', 'C');
const fwsPerf = performance.now();
fws.calculateSolutionForPackage('K1');
console.log(`\nTime taken: ${performance.now() - fwsPerf}ms`);