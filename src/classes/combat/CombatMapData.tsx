import { type } from "os";
import AnimationDetails from "../animation/AnimationDetails";
import Vector2 from "../utility/Vector2";
import AreaOfEffect from "./AreaOfEffect";
import CombatEntity from "./CombatEntity";
import CombatLocationData from "./CombatLocationData";
import CombatHazard from "./CombatHazard";
import CombatPlayer from "./CombatPlayer";
import ConditionDebug from "./Conditions/ConditionDebug";
import ConditionName from "./Conditions/ConditionNames";
import CombatEnemy from "./CombatEnemy";

class CombatMapData{
    locations: CombatLocationData[][];
    height: number;
    width: number;

    entityIdToNewPosition: Map<number, Vector2> = new Map<number, Vector2>();

    constructor(height: number, width: number){
      this.locations = [];
      this.height = height;
      this.width = width;
  
      for(let i = 0; i < height; i++){
        const row: CombatLocationData[] = [];
        for(let j = 0; j < width; j++){
          row.push(new CombatLocationData(j, i, "Combat Location", ".", false, false));
        }
  
        this.locations.push(row);
      }
    }

    /**
     * 
     * @param position x is the row number, y is the column number
     * @returns 
     */
    positionToCSSIdString(position: Vector2): string{
      return `#combat-location-${position.x*100+position.y}`;
    }    

    setLocationWithEntity(entity: CombatEntity):void{
      this.locations[entity.position.y][entity.position.x] = new CombatLocationData(entity.position.x, entity.position.y, entity.name + " " + entity.id, entity.symbol, false, false);
      this.locations[entity.position.y][entity.position.x].entity = entity;
    }
    setLocationWithHazard(hazard: CombatHazard):void{
      this.setLocationWithEntity(hazard);
      this.locations[hazard.position.y][hazard.position.x].solid = hazard.solid;
    }

    applyAnimationToEntity(id: number, animation: AnimationDetails):void{
      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity.id === id){
            location.animationList.push(animation);
          }
        });
      });     
    }

    getEntityById(id: number):CombatEntity|null{
      let entity:CombatEntity|null = null;
  
      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity.id === id){
            entity = location.entity;
          }

          if(entity){
            return;
          }
        });

        if(entity){
          return;
        }
      });
  
      if(entity){
        return entity;
      }
  
      return null;
    }

    getPlayer():CombatEntity|null{
      let player:CombatEntity|null = null;

      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity instanceof CombatPlayer){
            player = location.entity;
            return;
          }
        });
      });

      return player;
    }
  
    logCombatLocationData(){
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

    isInBounds(position: Vector2):boolean{
      return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height;
    }

    getEntitiesWithCondition(condition:ConditionName):CombatEntity[]{
      const entities:CombatEntity[] = [];
  
      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity.getConditions().find((cond) => cond.getName() === condition)){
            entities.push(location.entity);
          }
        });
      });
  
      return entities;
    }
  
    static clone(map: CombatMapData): CombatMapData{
      const newMap:CombatMapData = new CombatMapData(map.height, map.width);
      newMap.locations = map.locations.map((row) => {
        return row.map((location) => {
          return new CombatLocationData(location.x, location.y, location.name, location.symbol, location.highlight, location.solid, location.entity, location.animationList);
        });
      });
  
      return newMap;
    }

    swap00ToXY(x: number, y: number):void{
      //Find the two locations: 0,0 and x,y
      let zeroZeroLocation:CombatLocationData|undefined;
      let xyLocation:CombatLocationData|undefined;

      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.x === 0 && location.y === 0){
            zeroZeroLocation = location;
          }

          if(location.x === x && location.y === y){
            xyLocation = location;
          }
        });
      });

      //If both locations are found, swap them
      if(zeroZeroLocation && xyLocation){
        zeroZeroLocation.x = x;
        zeroZeroLocation.y = y;
        this.entityIdToNewPosition.set(zeroZeroLocation.entity?.id || -1, new Vector2(x, y));

        xyLocation.x = 0;
        xyLocation.y = 0;
        this.entityIdToNewPosition.set(xyLocation.entity?.id || -1, new Vector2(0, 0));
      }
    }

    swapZone1ToZone2(zone1:{start:Vector2, length:number, height:number}, zone2:{start:Vector2, length:number, height:number}):void{
      //Find all zone 1 locations
      const zone1Locations:CombatLocationData[] = [];
      for(let i = zone1.start.y; i < zone1.start.y + zone1.height; i++){
        for(let j = zone1.start.x; j < zone1.start.x + zone1.length; j++){
          if(this.isInBounds(new Vector2(j, i))){
            zone1Locations.push(this.locations[i][j]);
          }
        }
      }

      //Find all zone 2 locations
      const zone2Locations:CombatLocationData[] = [];
      for(let i = zone2.start.y; i < zone2.start.y + zone2.height; i++){
        for(let j = zone2.start.x; j < zone2.start.x + zone2.length; j++){
          if(this.isInBounds(new Vector2(j, i))){
            zone2Locations.push(this.locations[i][j]);
          }
        }
      }

      //Swap locations with the same index
      zone1Locations.forEach((location, index) => {
        const zone2Location = zone2Locations[index];
        const tempX = location.x;
        const tempY = location.y;

        location.x = zone2Location.x;
        location.y = zone2Location.y;
        this.entityIdToNewPosition.set(location.entity?.id || -1, new Vector2(zone2Location.x, zone2Location.y));

        zone2Location.x = tempX;
        zone2Location.y = tempY;
        this.entityIdToNewPosition.set(zone2Location.entity?.id || -1, new Vector2(tempX, tempY));
      });
    }


    applyAnyEntityChanges(entity:CombatEntity):void{
      const newPosition = this.entityIdToNewPosition.get(entity.id);

      if(newPosition){
        entity.position = newPosition;
      }
    }

    clearEntityChanges():void{
      this.entityIdToNewPosition.clear();
    }

    getEnemies():CombatEnemy[]{
      const enemies:CombatEnemy[] = [];

      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity instanceof CombatEnemy){
            enemies.push(location.entity);
          }
        });
      });

      return enemies;
    }

    getHazards():CombatHazard[]{
      const hazards:CombatHazard[] = [];

      this.locations.forEach((row) => {
        row.forEach((location) => {
          if(location.entity && location.entity instanceof CombatHazard){
            hazards.push(location.entity);
          }
        });
      });

      return hazards;
    }
  }

export default CombatMapData;