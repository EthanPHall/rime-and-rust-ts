import Directions from "../utility/Directions";
import MapUtilities from "../utility/MapUtilities";
import Vector2 from "../utility/Vector2";
import CombatMapData from "./CombatMapData";

class AreaOfEffect{
    length:number;
    direction:Directions;
    radius:number;
    cone:boolean;
    constructor(length:number, direction:Directions, radius:number, cone:boolean){
      this.length = length;
      this.direction = direction;
      this.radius = radius;
      this.cone = cone;
    }
    
    getAffectedCoordinates(startingX:number, startingY:number, map:CombatMapData|null) : Vector2[]{
      const affectedCoordinates:Vector2[] = [];
      affectedCoordinates.push(new Vector2(startingX, startingY));
      
      const linePoints:Vector2[] = this.getLinePoints(affectedCoordinates[0]);
      this.mergeCoordinates(affectedCoordinates, linePoints);
      
      if(this.cone){
        const conePoints:Vector2[] = this.getConePoints(linePoints);
        this.mergeCoordinates(affectedCoordinates, conePoints);
      }
      
      const radiusPoints:Vector2[] = this.getRadiusPoints(affectedCoordinates, map);
      this.mergeCoordinates(affectedCoordinates, radiusPoints);
  
      let occludedPoints:Vector2[]|null = null;
      if(map){
        occludedPoints = this.occludePoints(affectedCoordinates, new Vector2(startingX, startingY), map);
      }
  
      return occludedPoints ? occludedPoints : affectedCoordinates;
    }
  
    private mergeCoordinates(existingCoordinates:Vector2[], newCoordinates:Vector2[]) : void{
      newCoordinates.forEach((coordinate) => {
        const exists = existingCoordinates.some((existingCoordinate) => {
          return existingCoordinate.x === coordinate.x && existingCoordinate.y === coordinate.y;
        });
  
        if(!exists){
          existingCoordinates.push(coordinate);
        }
      });
    }
    
    private getLinePoints(start:Vector2) : Vector2[]{
      const directionVector:Vector2 = new Vector2(0, 0);
      const newPoints:Vector2[] = [];
  
      switch(this.direction){
        case Directions.UP:
          directionVector.x = 0;
          directionVector.y = -1;
          break;
        case Directions.DOWN:
          directionVector.x = 0;
          directionVector.y = 1;
          break;
        case Directions.LEFT:
          directionVector.x = -1;
          directionVector.y = 0;
          break;
        case Directions.RIGHT:
          directionVector.x = 1;
          directionVector.y = 0;
          break;
      }
  
      for(let i = 1; i < this.length; i++){
        newPoints.push(new Vector2(start.x + directionVector.x*i, start.y + directionVector.y*i));
      }
  
      return newPoints;
    }
  
    private getConePoints(linePoints:Vector2[]) : Vector2[]{
      const directionVector:Vector2 = new Vector2(0, 0);
      const newPoints:Vector2[] = [];
  
      switch(this.direction){
        case Directions.UP:
        case Directions.DOWN:
          directionVector.x = 1;
          directionVector.y = 0;
          break;
        case Directions.LEFT:
        case Directions.RIGHT:
          directionVector.x = 0;
          directionVector.y = 1;
          break;
      }
  
      for(let i = 0; i < linePoints.length; i++){
        for(let j = i+1; j > 0; j--){
          newPoints.push(new Vector2(linePoints[i].x + directionVector.x*j, linePoints[i].y + directionVector.y*j));
          newPoints.push(new Vector2(linePoints[i].x - directionVector.x*j, linePoints[i].y - directionVector.y*j));
        }
      }
  
      return newPoints;
    }
  
    private getRadiusPoints(existingPoints:Vector2[], map:CombatMapData|null):Vector2[]{
      const newPoints:Vector2[] = [];
  
      existingPoints.forEach(point => {
        const radiusPoints:Vector2[] = MapUtilities.breadthFirstSearch(map, point.x, point.y, this.radius);
        this.mergeCoordinates(newPoints, radiusPoints);
      });
  
      return newPoints;
    }
  
    private occludePoints(existingPoints:Vector2[], origin:Vector2, map:CombatMapData):Vector2[]{
      const newPoints:Vector2[] = [];
  
      if(map.locations[origin.y][origin.x].solid){
        return newPoints;
      }
  
      existingPoints.forEach((existingPoint) => {
        const originToPointLine:Vector2[] = MapUtilities.getLineBetweenPoints(origin, existingPoint);
        
        let blocked:boolean = false;
        for(let i = 0; i < originToPointLine.length; i++){
          const otplPoint = originToPointLine[i];
  
          if(map.locations[otplPoint.y][otplPoint.x].solid){
            blocked = true;
            break;
          }
        }
  
        if(!blocked){
          newPoints.push(existingPoint);
        }
      });
  
      return newPoints;
    }
  }

export default AreaOfEffect;