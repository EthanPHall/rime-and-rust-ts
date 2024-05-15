import CombatMapData from "../combat/CombatMapData";
import Directions from "./Directions";
import Vector2 from "./Vector2";

class MapUtilities{
    static MAX_HEIGHT = 99;
    static MAX_WIDTH = 99;
  
    static getDistance(a:Vector2, b:Vector2):number{
      return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }
  
    static getDistanceSquared(a:Vector2, b:Vector2):number{
      return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
    }
  
    static getDirections(x1:number, y1:number, x2:number, y2:number):Directions{
      if(x1 === x2){
        if(y1 > y2){
          return Directions.UP;
        }else if(y1 < y2){
          return Directions.DOWN;
        }
      }else if(y1 === y2){
        if(x1 > x2){
          return Directions.LEFT;
        }else if(x1 < x2){
          return Directions.RIGHT;
        }
      }
  
      return Directions.UP;
    }
  
    static breadthFirstSearch(map:CombatMapData|null, startingX:number, startingY:number, distance:number):Vector2[]{
      //Copilot has given a potential improvement: chnage visited to a Set, and store stringified versions
      //of points so that I can use Set.has, a constant time way to check for existing things. I won't do that unless
      //this is slow though.
      const visited:Vector2[] = [];
      const height = map ? map.height : MapUtilities.MAX_HEIGHT;
      const width = map ? map.width : MapUtilities.MAX_WIDTH;
  
      //By comparing distances squared to eachother, I avoid having to do take square roots. Should be more efficient.
      //Probably premature optimization, but I'm more comfortable with this method from working with Unity.
      const distanceSquared = distance*distance;
  
      const increments:Vector2[] = [
        new Vector2(1, 0),
        new Vector2(-1, 0),
        new Vector2(0, 1),
        new Vector2(0, -1)
      ]
  
      const queue: Vector2[] = [];
      queue.push(new Vector2(startingX, startingY));
      const history:Vector2[] = [];
      
      while(queue.length > 0){
        const currentPoint:Vector2 = queue[0];
        visited.push(currentPoint);
        history.push(currentPoint);
        queue.shift();
  
        for(let i:number = 0; i < increments.length; i++){
          const currentIncrement:Vector2 = increments[i];
          const newPoint:Vector2 = new Vector2(currentPoint.x + currentIncrement.x, currentPoint.y + currentIncrement.y);
          
          const alreadyInHistory = history.some(point => {
            return point.x === newPoint.x && point.y === newPoint.y;
          });
          if(!alreadyInHistory){
            history.push(newPoint);
          }
          else{
            continue;
          }
          
          if(MapUtilities.getDistanceSquared(new Vector2(startingX, startingY), newPoint) <= distanceSquared && MapUtilities.isPointInBounds(newPoint, width, height)){
            queue.push(newPoint);
          }
        }
      }
  
      return visited;
    }
  
    static getLineBetweenPoints(start:Vector2, end:Vector2):Vector2[]{
      const points:Vector2[] = [];
      const deltaX:number = Math.abs(end.x - start.x);
      const deltaY:number = Math.abs(end.y - start.y);
      const signX:number = start.x < end.x ? 1 : -1;
      const signY:number = start.y < end.y ? 1 : -1;
      let error:number = deltaX - deltaY;
      let currentX:number = start.x;
      let currentY:number = start.y;
  
      while(currentX !== end.x || currentY !== end.y){
        points.push(new Vector2(currentX, currentY));
        const doubleError = error * 2;
        if(doubleError > -deltaY){
          error -= deltaY;
          currentX += signX;
        }
        if(doubleError < deltaX){
          error += deltaX;
          currentY += signY;
        }
      }
  
      return points;
    }
  
    static isPointInBounds(point: Vector2, mapWidth:number, mapHeight:number): boolean{
      return point.x < mapWidth && point.x >= 0 && point.y < mapHeight && point.y >= 0;
    }
  }

    export default MapUtilities;