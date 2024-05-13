import React, { FC, useEffect, useMemo, useState } from 'react';
import './CombatMap.css';
import CombatMapLocation from '../CombatMapLocation/CombatMapLocation';
import CombatMapManager from '../../../classes/combat/CombatMapManager';

interface CombatMapProps {}

class MapUtilities{
  static MAX_HEIGHT = 99;
  static MAX_WIDTH = 99;

  static getDistance(a:Vector2, b:Vector2):number{
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  static getDistanceSquared(a:Vector2, b:Vector2):number{
    return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
  }

  static getDirection(x1:number, y1:number, x2:number, y2:number):Direction{
    if(x1 === x2){
      if(y1 > y2){
        return Direction.UP;
      }else if(y1 < y2){
        return Direction.DOWN;
      }
    }else if(y1 === y2){
      if(x1 > x2){
        return Direction.LEFT;
      }else if(x1 < x2){
        return Direction.RIGHT;
      }
    }

    return Direction.UP;
  }

  static breadthFirstSearch(map:Map|null, startingX:number, startingY:number, distance:number):Vector2[]{
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

class LocationData{
  id: number;
  x: number;
  y: number;
  name: string;
  symbol: string;
  highlight: boolean;
  solid: boolean;
  constructor(id: number, x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false, solid: boolean = false){
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.symbol = symbol;
    this.highlight = highlight;
    this.solid = solid;
  }
}

enum Direction{
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

class Vector2{
  x:number;
  y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

class AreaOfEffect{
  length:number;
  direction:Direction;
  radius:number;
  cone:boolean;
  constructor(length:number, direction:Direction, radius:number, cone:boolean){
    this.length = length;
    this.direction = direction;
    this.radius = radius;
    this.cone = cone;
  }
  
  getAffectedCoordinates(startingX:number, startingY:number, map:Map|null) : Vector2[]{
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
      case Direction.UP:
        directionVector.x = 0;
        directionVector.y = -1;
        break;
      case Direction.DOWN:
        directionVector.x = 0;
        directionVector.y = 1;
        break;
      case Direction.LEFT:
        directionVector.x = -1;
        directionVector.y = 0;
        break;
      case Direction.RIGHT:
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
      case Direction.UP:
      case Direction.DOWN:
        directionVector.x = 1;
        directionVector.y = 0;
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
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

  private getRadiusPoints(existingPoints:Vector2[], map:Map|null):Vector2[]{
    const newPoints:Vector2[] = [];

    existingPoints.forEach(point => {
      const radiusPoints:Vector2[] = MapUtilities.breadthFirstSearch(map, point.x, point.y, this.radius);
      this.mergeCoordinates(newPoints, radiusPoints);
    });

    return newPoints;
  }

  private occludePoints(existingPoints:Vector2[], origin:Vector2, map:Map):Vector2[]{
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

class Map{
  locations: LocationData[][];
  height: number;
  width: number;
  constructor(height: number, width: number){
    this.locations = [];
    this.height = height;
    this.width = width;

    for(let i = 0; i < height; i++){
      const row: LocationData[] = [];
      for(let j = 0; j < width; j++){
        row.push(new LocationData(i*10+j, i, j, "Combat Location", ".", false));
      }

      this.locations.push(row);
    }
  }

  logLocationData(){
    this.locations.forEach((row) => {
      row.forEach((location) => {
        console.log(location);
      });
    });
  }

  highlightAOE(aoeData: AreaOfEffect, origin:Vector2):void{
    this.dehighlightAll();

    const aoePoints:Vector2[] = aoeData.getAffectedCoordinates(origin.x, origin.y, this);
    
    this.locations.forEach((row) => {
      row.forEach((location) => {
        location.highlight = false;
      });
    });

    aoePoints.forEach((point) => {
      this.locations[point.y][point.x].highlight = true;
    });
  }

  highlightByCoordinates(coordinates:Vector2[]):void{
    this.dehighlightAll();

    coordinates.forEach((point) => {
      this.locations[point.y][point.x].highlight = true;
    });
  }

  dehighlightAll():void{
    this.locations.forEach((row) => {
      row.forEach((location) => {
        location.highlight = false;
      });
    });
  }

  static clone(map: Map): Map{
    const newMap:Map = new Map(map.height, map.width);
    newMap.locations = map.locations.map((row) => {
      return row.map((location) => {
        return new LocationData(location.id, location.x, location.y, location.name, location.symbol, location.highlight, location.solid);
      });
    });

    return newMap;
  }
}

const CombatMap: FC<CombatMapProps> = (props:CombatMapProps) => {
  const [map, setMap] = useState<Map>(new Map(15, 15));  
  const [aoe, setAOE] = useState<AreaOfEffect>(new AreaOfEffect(0, Direction.UP, 5, false));

  useMemo(() => {
    map.locations[7][8].solid = true;
    map.locations[7][8].symbol = "#";
    map.locations[7][3].symbol = "E";
    map.locations[7][9].symbol = "E";
    map.locations[7][7].symbol = "@";

  }, []);

  function highlightAOE(){
    map.highlightAOE(aoe, new Vector2(7, 7));

    setMap(Map.clone(map));
  }

  function logLocationData(){
    map.logLocationData();
  }

  function highlightPlayer(){
    const playerLocation:Vector2 = new Vector2(7, 7);
    map.highlightByCoordinates([playerLocation]);

    setMap(Map.clone(map));
  }

  return (
    <>
      <button className='highlight-button' onClick={highlightAOE}>Highlight</button>
      <button className='highlight-button' onClick={highlightPlayer}>Highlight Player</button>
      {/* <button className='log-button' onClick={logLocationData}>Log</button> */}
      <div className="combat-map" data-testid="combat-map">
        {map.locations.map((row, i) => {
          return (
            <div key={"combat-map-" + row + "-" + i} className="combat-map-row">
              {row.map((location, j) => {
                return (
                  <span className={`combat-map-location ${location.highlight ? "highlight" : ""}`} key={"combat-map-location:"+location.id}>{location.symbol}</span>
                );
              })}
            </div>
          );
        }
      )}
      </div>  
    </>
  );
}

export default CombatMap;
