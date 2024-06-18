import CombatEntity from "../combat/CombatEntity";
import CombatLocationData from "../combat/CombatLocationData";
import CombatMapData from "../combat/CombatMapData";
import Directions, { DirectionsUtility } from "../utility/Directions";
import Vector2 from "../utility/Vector2";

class PathfindingUtil{
    static findPath(start: Vector2, goal: Vector2, mapData: CombatMapData): Directions[] {
        const debug_toStringList: string[] = [];


        // Initialize open and closed lists
        const openList: Vector2[] = [start];
        const closedList: Vector2[] = [];

        // Initialize the cost and heuristic values for the start node
        const gScore: { [key: string]: number } = { [start.toString()]: 0 };
        const hScore: { [key: string]: number } = { [start.toString()]: start.manhattanDistance(goal) };
        const fScore: { [key: string]: number } = { [start.toString()]: hScore[start.toString()] };

        // Initialize the cameFrom object to keep track of the path
        const cameFrom: { [key: string]: Vector2 | null } = {};

        // get the neighbors of teh goal
        const goalPlusDirectNeighbors = DirectionsUtility.getNeighbors(goal, mapData);
        goalPlusDirectNeighbors.push(goal);

        //Get the neighbors of the goal neighbors
        const indirectGoalNeighbors: Vector2[] = [];
        for(const neighbor of goalPlusDirectNeighbors){
            const neighbors = DirectionsUtility.getNeighbors(neighbor, mapData);
            for(const neighbor of neighbors){
                if(!goalPlusDirectNeighbors.some((node) => node.equals(neighbor))){
                    indirectGoalNeighbors.push(neighbor);
                }
            }
        }

        while (openList.length > 0) {
            // Find the node with the lowest fScore
            const current = openList.reduce((a, b) => (fScore[a.toString()] < fScore[b.toString()] ? a : b));

            // If the current node is the goal, or is surrounding the goal, reconstruct the path and return it
            // if (current.equals(goal)) {
            //     return this.reconstructPath(cameFrom, current);
            // }
            if(goalPlusDirectNeighbors.some((node) => node.equals(current))){
                return this.reconstructPath(cameFrom, current);
            }
            else if(
                !goalPlusDirectNeighbors.some((node) => {return !mapData.locations[node.y][node.x].entity || mapData.locations[node.y][node.x].entity?.isWalkable()}) && 
                indirectGoalNeighbors.some((node) => node.equals(current))
            ){
                return this.reconstructPath(cameFrom, current);
            }

            // Move the current node from open to closed list
            openList.splice(openList.indexOf(current), 1);
            closedList.push(current);

            // Get the neighbors of the current node
            const neighbors = DirectionsUtility.getNeighbors(current, mapData);

            for (const neighbor of neighbors) {

                // Skip if the neighbor is in the closed list
                if (closedList.some((node) => node.equals(neighbor))) {
                    continue;
                }

                // Calculate the tentative gScore for the neighbor
                const entityAtNeighborLocation:CombatEntity | null = mapData.locations[neighbor.y][neighbor.x].entity;
                const tentativeGScore = entityAtNeighborLocation && !entityAtNeighborLocation.isWalkable() ? Infinity : gScore[current.toString()] + current.manhattanDistance(neighbor);

                // Add the neighbor to the open list if it's not already in it
                if (!openList.some((node) => node.equals(neighbor))) {
                    openList.push(neighbor);
                } else if (tentativeGScore >= gScore[neighbor.toString()]) {
                    // Skip if the tentative gScore is not better than the current gScore
                    continue;
                }

                // Update the cameFrom, gScore, hScore, and fScore values for the neighbor
                cameFrom[neighbor.toString()] = current;
                gScore[neighbor.toString()] = tentativeGScore;
                hScore[neighbor.toString()] = neighbor.manhattanDistance(goal);
                fScore[neighbor.toString()] = gScore[neighbor.toString()] + hScore[neighbor.toString()];
                
                if(debug_toStringList.some((string) => {return string === neighbor.toString()})){
                    console.log("Duplicate Node: " + neighbor.toString());
                }
                debug_toStringList.push(neighbor.toString());
            }
        }

        // If no path is found, return an empty array
        return [];
    }

    static reconstructPath(cameFrom: { [key: string]: Vector2 | null }, current: Vector2): Directions[] {
        const path: Directions[] = [];

        while (cameFrom[current.toString()]) {
            const previous = cameFrom[current.toString()]!;
            const direction = DirectionsUtility.getDirectionFromCoordinates(previous, current);
            path.unshift(direction);
            current = previous;
        }

        return path;
    }

    static findStoppingPoint(start: Vector2, directions: Directions[], movementLimit:number): Vector2 {
        let current = start;
        let i = 0;

        while (i < directions.length && movementLimit > 0) {
            const direction = directions[i];
            const next = Vector2.add(current, DirectionsUtility.getVectorFromDirection(direction));
            current = next;
            i++;
            movementLimit--;
        }

        return current;
    }
}

export default PathfindingUtil;