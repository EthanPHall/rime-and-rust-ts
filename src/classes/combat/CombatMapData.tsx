import { type } from "os";
import AnimationDetails from "../animation/AnimationDetails";
import Vector2 from "../utility/Vector2";
import AreaOfEffect from "./AreaOfEffect";
import CombatEntity from "./CombatEntity";
import CombatLocationData from "./CombatLocationData";
import CombatHazard from "./CombatHazard";

class CombatMapData{
    locations: CombatLocationData[][];
    height: number;
    width: number;
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

    positionToCSSIdString(position: Vector2): string{
      return `#combat-location-${position.y*100+position.x}`;
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
  
    static clone(map: CombatMapData): CombatMapData{
      const newMap:CombatMapData = new CombatMapData(map.height, map.width);
      newMap.locations = map.locations.map((row) => {
        return row.map((location) => {
          return new CombatLocationData(location.x, location.y, location.name, location.symbol, location.highlight, location.solid, location.entity, location.animationList);
        });
      });
  
      return newMap;
    }
  }

export default CombatMapData;