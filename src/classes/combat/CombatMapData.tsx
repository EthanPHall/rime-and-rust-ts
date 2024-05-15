import Vector2 from "../utility/Vector2";
import AreaOfEffect from "./AreaOfEffect";
import CombatLocationData from "./CombatLocationData";

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
          row.push(new CombatLocationData(i*10+j, i, j, "Combat Location", ".", false));
        }
  
        this.locations.push(row);
      }
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
          return new CombatLocationData(location.id, location.x, location.y, location.name, location.symbol, location.highlight, location.solid);
        });
      });
  
      return newMap;
    }
  }

export default CombatMapData;