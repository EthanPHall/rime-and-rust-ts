import MapUtilities from "../utility/MapUtilities";
import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";

abstract class CombatHazard extends CombatEntity{
    solid: boolean;
    onlyDisplayOneInSidebar: boolean;
  
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean, description?: string, onlyDisplayOneInSidebar: boolean = false){
      super(hp, maxHp, symbol, name, position, description);
      this.solid = solid;
      this.onlyDisplayOneInSidebar = onlyDisplayOneInSidebar;
    }
  }
  
  class Wall extends CombatHazard{
    static WALL_HP = 10;
    static WALL_DESCRIPTION:string = 'Sturdy walls. Click a specific wall in the map to see its health.';
  
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
      super(hp, maxHp, symbol, name, position, solid, Wall.WALL_DESCRIPTION, true);
    }
  
    static createDefaultWall(position: Vector2): Wall{
      return new Wall(Wall.WALL_HP, Wall.WALL_HP, '#', 'Wall', position, true);
    }
  
    static createDefaultWalls(startEndPointPair: {start:Vector2, end:Vector2}[]): Wall[]{
      const walls: Wall[] = [];
  
      startEndPointPair.forEach(pair => {
        const line:Vector2[] = MapUtilities.getLineBetweenPoints(pair.start, pair.end);
  
        line.forEach(point => {
          walls.push(Wall.createDefaultWall(point));
        });
      });
  
      return walls;
    }
  }
  
  class VolatileCanister extends CombatHazard{
    constructor(hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
      super(hp, maxHp, symbol, name, position, solid);
    }
  }

export default CombatHazard;
export { Wall, VolatileCanister };