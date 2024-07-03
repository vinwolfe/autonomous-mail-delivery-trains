import {  StationRouteData, Train, Package, ResultPath, SolutionResult, ShortestPath } from './types';
import { errors } from './constants';

// Class implementing the Floyd-Warshall algorithm for finding the shortest paths between all pairs of stations
export class FloydWarshallSolution {
    adjacencyList: Record<string, StationRouteData[]>; // Graph representation: station name to routes
    trains: Record<string, Train>; // Available trains mapped by their names
    packages: Record<string, Package>; // Packages to be delivered, mapped by their names
    shortestPaths: Record<string, Record<string, ShortestPath>>; // Stores shortest paths between all pairs of stations

    constructor() {
        this.adjacencyList = {}; // Initialise the adjacency list for the graph
        this.trains = {}; // Initialise the list of trains
        this.packages = {}; // Initialise the list of packages
        this.shortestPaths = {}; // Initialise the shortest paths record
    }

    // Adds a station to the graph and initialises paths for Floyd-Warshall algorithm
    addStation(station: string) {
        if (!this.adjacencyList[station]) {
            this.adjacencyList[station] = [];
        
            this.shortestPaths[station] = {};
            this.shortestPaths[station][station] = { path: [station], totalTime: 0 };

            if(Object.keys(this.shortestPaths).length > 0) {
                for (const startStation in this.shortestPaths) {
                    this.shortestPaths[startStation][station] = { path: [], totalTime: Infinity };
                    this.shortestPaths[station][startStation] = { path: [], totalTime: Infinity };
                }
            }
        }
    }

    // Adds a route between two stations and updates the shortest paths
    addRoute(name: string, station1: string, station2: string, timeInMinutes: number) {
        this.ensureStationExists(station1);
        this.ensureStationExists(station2);
        this.adjacencyList[station1].push({ name, station: station2, timeInMinutes });
        this.adjacencyList[station2].push({ name, station: station1, timeInMinutes });

        this.precomputeAllPaths();
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

    // Calculates the best solution for delivering a package using precomputed shortest paths
    calculateSolutionForPackage(packageName: string): any {
        const packageData = this.ensurePackageExists(packageName);
        this.ensureStationExists(packageData.startingStation);
        this.ensureStationExists(packageData.destinationStation);

        const trains = this.getAvailableTrainsForPackage(packageData);

        const { path: packagePath, totalTime: packagePathTime } = this.shortestPaths[packageData.startingStation][packageData.destinationStation];
        if (packagePathTime === Infinity) throw new Error(errors.noRouteFound);

        const { chosenTrain, chosenPath } = this.selectOptimalTrainPathForPackage(trains, packagePath, packagePathTime);
        return this.generateSolutionResult(chosenTrain, chosenPath, packageData);
    }

    // Floyd-Warshall Algorithm Implementation
    precomputeAllPaths(): void {
        // Initialise shortestPaths with direct routes
        for (const startStation in this.adjacencyList) {
            this.shortestPaths[startStation] = {};
            for (const endStation in this.adjacencyList) {
                if (startStation === endStation) {
                    this.shortestPaths[startStation][endStation] = { path: [startStation], totalTime: 0 };
                } else {
                    this.shortestPaths[startStation][endStation] = { path: [], totalTime: Infinity };
                }
            }
        }
    
        // Update with direct routes from adjacencyList
        for (const startStation in this.adjacencyList) {
            for (const route of this.adjacencyList[startStation]) {
                this.shortestPaths[startStation][route.station] = { path: [startStation, route.station], totalTime: route.timeInMinutes };
            }
        }
    
        // Update shortest paths for all pairs using intermediate stations
        for (const k in this.adjacencyList) {
            for (const i in this.adjacencyList) {
                for (const j in this.adjacencyList) {
                    if (this.shortestPaths[i][k].totalTime + this.shortestPaths[k][j].totalTime < this.shortestPaths[i][j].totalTime) {
                        const newPath = [...this.shortestPaths[i][k].path.slice(0, -1), ...this.shortestPaths[k][j].path];
                        const newTotalTime = this.shortestPaths[i][k].totalTime + this.shortestPaths[k][j].totalTime;
                        this.shortestPaths[i][j] = { path: newPath, totalTime: newTotalTime };
                    }
                }
            }
        }
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
    
        // Find the train that results in the shortest total time to deliver the package
        trains.forEach(train => {
            const trainToPackagePathInfo = this.shortestPaths[train.startingStation][packagePath[0]];
            const totalTime = trainToPackagePathInfo.totalTime + packagePathTime;
            if (totalTime < shortestTime) {
                shortestTime = totalTime;
                chosenTrain = train;
                chosenPath = [...trainToPackagePathInfo.path, ...packagePath.slice(1)];
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