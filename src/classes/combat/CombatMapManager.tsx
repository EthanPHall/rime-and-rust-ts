import AllCombatMapData from "../../data/combat/CombatMapData.json";
import CombatLocationData from "./CombatLocationData";
import CombatMapData from "./CombatMapData";

class CombatMapManager{
    // mapData: CombatMapData;
    // map: CombatLocationData[][];
    // constructor(){
    //     //TODO: Replace this with a constructor argument 
    //     const json = AllCombatMapData.Map2;

    //     this.mapData = new CombatMapData(json.width, json.height);
        
    //     this.map = [];
    // }

    // BuildMap(){
    //     this.map = [];
    //     this.BuildMapBase();
    // }

    // private BuildMapBase(){
    //     for(let y = 0; y < this.mapData.height; y++){
    //         let row: CombatLocationData[] = [];
    //         for(let x = 0; x < this.mapData.width; x++){
    //             let locationData = new CombatLocationData(y*10+x, x, y);
    //             row.push(locationData);
    //         }

    //         this.map.push(row);
    //     }
    // }

    // GetMap(){
    //     return this.map;
    // }
}

export default CombatMapManager;