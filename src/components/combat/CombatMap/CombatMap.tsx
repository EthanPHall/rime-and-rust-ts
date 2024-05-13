import React, { FC, useEffect, useMemo, useState } from 'react';
import './CombatMap.css';
import CombatMapLocation from '../CombatMapLocation/CombatMapLocation';
import CombatMapManager from '../../../classes/combat/CombatMapManager';

interface CombatMapProps {}

class MapUtilities{
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

  static breadthFirstSearch(map:Map, startingX:number, startingY:number, distance:number):LocationData[]{
    const visited:LocationData[] = [];
    const locations:LocationData[][] = map.locations;
    const height = locations.length;
    const width = locations[0].length;
    const distanceSquared = distance*distance;

    const increments:Vector2[] = [
      new Vector2(1, 0),
      new Vector2(-1, 0),
      new Vector2(0, 1),
      new Vector2(0, -1)
    ]

    const queue: Vector2[] = [];
    queue.push(new Vector2(startingX, startingY));
    
    while(queue.length > 0){
      const currentPoint:Vector2 = queue[0];

      for(let i:number = 0; i < increments.length; i++){
        const currentIncrement:Vector2 = increments[i];
        const newPoint:Vector2 = new Vector2(currentPoint.x + currentIncrement.x, currentPoint.y + currentIncrement.y); 
      }
    }

    return visited;
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
  constructor(id: number, x: number, y: number, name: string = "Combat Location", symbol: string = ".", highlight: boolean = false){
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.symbol = symbol;
    this.highlight = highlight;
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

class AOEData{
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
  
  getAffectedCoordinates(startingX:number, startingY:number) : Vector2[]{
    const affectedCoordinates:Vector2[] = [];
    affectedCoordinates.push(new Vector2(startingX, startingY));
    
    const linePoints:Vector2[] = this.getLinePoints(affectedCoordinates[0]);
    this.mergeCoordinates(affectedCoordinates, linePoints);

    if(this.cone){
      const conePoints:Vector2[] = this.getConePoints(linePoints);
      this.mergeCoordinates(affectedCoordinates, conePoints);
    }

    const radiusPoints:Vector2[] = this.getRadiusPoints(affectedCoordinates);

    return affectedCoordinates;
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
      for(let j = i; j > 0; j--){
        newPoints.push(new Vector2(linePoints[i].x + directionVector.x*j, linePoints[i].y + directionVector.y*j));
        newPoints.push(new Vector2(linePoints[i].x - directionVector.x*j, linePoints[i].y - directionVector.y*j));
      }
    }

    return newPoints;
  }

  private getRadiusPoints(existingPoints:Vector2[]):Vector2[]{
    const newPoints:Vector2[] = [];

    this.mergeCoordinates(newPoints, existingPoints);

    existingPoints.forEach(point => {
      const radiusPoints:Vector2[] = [];
      
    });

    return newPoints;
  }
}

class Map{
  locations: LocationData[][];
  constructor(dimensionX: number, dimensionY: number){
    this.locations = [];
    for(let i = 0; i < dimensionX; i++){
      const row: LocationData[] = [];
      for(let j = 0; j < dimensionY; j++){
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

  highlightAOE(aoeData: AOEData){
    
  }

  static clone(map: Map): Map{
    const newMap = new Map(0, 0);
    newMap.locations = map.locations.map((row) => {
      return row.map((location) => {
        return new LocationData(location.id, location.x, location.y, location.name, location.symbol, location.highlight);
      });
    });

    return newMap;
  }
}

const CombatMap: FC<CombatMapProps> = (props:CombatMapProps) => {
  const [map, setMap] = useState<Map>(new Map(5, 5));  
  
  function highlight(){
    setMap((prevMap) => {
      const newMap = Map.clone(prevMap);
      newMap.locations[0][0].highlight = !newMap.locations[0][0].highlight;
      return newMap;
    });
  }

  function logLocationData(){
    map.logLocationData();
  }

  return (
    <>
      <button className='highlight-button' onClick={highlight}>Highlight</button>
      <button className='log-button' onClick={logLocationData}>Log</button>
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
