import { PriorityQueue } from './priorityQueue';
import {  StationRouteData, Train, Package, ResultPath, SolutionResult } from './types';
import { errors } from './constants';

// Class implementing Dijkstra's algorithm for finding the shortest path in a graph
export class DijkstrasSolution {
    adjacencyList: Record<string, StationRouteData[]>; // Graph representation: station name to routes
    trains: Record<string, Train>; // Available trains mapped by their names
    packages: Record<string, Package>; // Packages to be delivered, mapped by their names

    constructor() {
        this.adjacencyList = {}; // Initialise the adjacency list for the graph
        this.trains = {}; // Initialise the list of trains
        this.packages = {}; // Initialise the list of packages
    }

    // Adds a station to the graph if it doesn't already exist
    addStation(station: string) {
        if (!this.adjacencyList[station]) {
            this.adjacencyList[station] = [];
        } 
    }

    // Adds a route between two stations
    addRoute(name: string, station1: string, station2: string, timeInMinutes: number) {
        this.ensureStationExists(station1);
        this.ensureStationExists(station2);
        this.adjacencyList[station1].push({ name, station: station2, timeInMinutes });
        this.adjacencyList[station2].push({ name, station: station1, timeInMinutes });
    }

    // Adds a train with its capacity and starting station
    addTrain(name: string, capacityInKg: number, startingStation: string) {
        this.ensureStationExists(startingStation);
        this.trains[name] = { name, capacityInKg, startingStation };
    }

    // Adds a package with its weight, starting, and destination stations
    addPackage(name: string, weightInKg: number, startingStation: string, destinationStation: string) {
        this.packages[name] = { name, weightInKg, startingStation, destinationStation };
    }

    // Calculates the best solution for delivering a package
    calculateSolutionForPackage(packageName: string): any {
        const packageData = this.ensurePackageExists(packageName);
        this.ensureStationExists(packageData.startingStation);
        this.ensureStationExists(packageData.destinationStation);

        // Get trains that can carry the package
        const trains = this.getAvailableTrainsForPackage(packageData);
    
        // Find the shortest path and its duration from start to destination
        const [ packagePath, packagePathTime ] = this.findShortestPath(packageData.startingStation, packageData.destinationStation);
        if (packagePathTime === Infinity) throw new Error(errors.noRouteFound);

        // Select the optimal train and path for the package
        const { chosenTrain, chosenPath } = this.selectOptimalTrainPathForPackage(trains, packagePath, packagePathTime);
        
        // Generate and return the solution result
        return this.generateSolutionResult(chosenTrain, chosenPath, packageData);
    }

    // Dijkstra's Algorithm Implementation
	findShortestPath(start: string, end: string): [string[], number]{
        if (!this.adjacencyList[start] || !this.adjacencyList[end]) return [[], 0];
        if(start === end) return [[start], 0];

		const nodes = new PriorityQueue();
		const distances: { [key: string]: number }  = {};
		const previous: { [key: string]: string | null } = {};
		let path: string[] = []; // to return at end
		let smallest: string | null = null;
        
        for (let vertex in this.adjacencyList) {
            distances[vertex] = vertex === start ? 0 : Infinity;
            nodes.enqueue(vertex, distances[vertex]);
            previous[vertex] = null;
        }
		
		while(nodes.values.length) {
			smallest = nodes.dequeue().value;
			if(smallest === end) {
                // Build path

				while(previous[smallest!]) {
                    const time = distances[smallest!];
					path.push(smallest!);
					smallest = previous[smallest!];
				}
				break;
			}
			
			if(smallest || distances[smallest] !== Infinity) {
				for(let neighbour of this.adjacencyList[smallest]) {
					let candidate = distances[smallest] + neighbour.timeInMinutes;
					let nextNeighbour = neighbour.station;
					
					if(candidate < distances[nextNeighbour]) {
						distances[nextNeighbour] = candidate;
						previous[nextNeighbour] = smallest;
						nodes.enqueue(nextNeighbour, candidate);
					}
				}
			}
		}
        
        if (smallest) {
            path = path.concat(smallest).reverse();
        } else {
            path = path.reverse();
        }
        
        return [path, distances[end]];
	}

    // Ensures a station exists in the adjacency list, throws an error if not
    private ensureStationExists(station: string) {
        if (!this.adjacencyList[station]) {
            throw new Error(errors.stationDoesNotExist);
        }
    }

    // Ensures a package exists in the package list, throws an error if not
    private ensurePackageExists(packageName: string): Package {
        const packageData = this.packages[packageName];
        if (!packageData) throw new Error(errors.packageDoesNotExist);
        return packageData;
    }

    // Filters available trains that can carry the package based on its weight
    private getAvailableTrainsForPackage(packageData: Package): Train[] {
        const availableTrains =  Object.values(this.trains).filter(train => train.capacityInKg >= packageData.weightInKg);
        if(!availableTrains.length) throw new Error(errors.noTrainsAvailable);
        return availableTrains;
    }

    // Selects the optimal train and path for delivering the package
    private selectOptimalTrainPathForPackage(trains: Train[], packagePath: string[], packagePathTime: number): { chosenTrain: Train, chosenPath: string[] } {
        let shortestTime = Infinity;
        let chosenTrain: Train | null = null;
        let chosenPath: string[] = [];
        
        trains.forEach(train => {
            const [trainToPackagePath, trainToPackagePathTime] = this.findShortestPath(train.startingStation, packagePath[0]);
            const totalTime = trainToPackagePathTime + packagePathTime;
            
            if (totalTime < shortestTime) {
                shortestTime = totalTime;
                chosenTrain = train;
                chosenPath = [...trainToPackagePath, ...packagePath.slice(1)]; // Avoid duplicating the starting station
            }
        });
    
        if (!chosenTrain) throw new Error(errors.noTrainsAvailable);
        
        return { chosenTrain, chosenPath };
    }
    
    // Generates the solution result for the package delivery
    private generateSolutionResult(chosenTrain: Train, chosenPath: string[], packageData: Package): SolutionResult {
        let result: SolutionResult = {};
        const T = chosenTrain.name;
        const packageName = packageData.name;
        let W = 0;

        let resultPath: ResultPath[] = [];

                
        for(let pathIdx = 0; pathIdx < chosenPath.length - 1; pathIdx++) {
            const N1 = chosenPath[pathIdx];
            const N2 = chosenPath[pathIdx + 1];
            const route = this.adjacencyList[N1].find(route => route.station === N2);
            const routeName = route!.name;
            const routeTime = route!.timeInMinutes;

            const P1 = packageData.startingStation === N1 ? [ packageName ] : [];
            const P2 = packageData.destinationStation === N2 ? [ packageName ] : [];

            const summary = `Move train ${T} from station ${N1} to station ${N2} via route ${routeName}. Takes ${routeTime} minutes.`;
            resultPath.push({ summary, W, T, N1, P1, N2, P2 });
            console.log(summary + ` W: ${W}, T: ${T}, N1: ${N1}, P1: [${P1.toString()}], N2: ${N2}, P2: [${P2.toString()}]`);
            W += routeTime;
        };

        result[T] = { path: resultPath, totalTime: W };
    
        return result;
    }
}