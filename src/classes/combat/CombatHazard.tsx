import IdGenerator from "../utility/IdGenerator";
import MapUtilities from "../utility/MapUtilities";
import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";

abstract class CombatHazard extends CombatEntity{
    solid: boolean;
    onlyDisplayOneInSidebar: boolean;
  
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean, description?: string, onlyDisplayOneInSidebar: boolean = false){
      super(id, hp, maxHp, symbol, name, position, description);
      this.solid = solid;
      this.onlyDisplayOneInSidebar = onlyDisplayOneInSidebar;
    }
  }
  
  class Wall extends CombatHazard{
    static WALL_HP = 10;
    static WALL_DESCRIPTION:string = 'Sturdy walls. Click a specific wall in the map to see its health.';
  
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
      super(id, hp, maxHp, symbol, name, position, solid, Wall.WALL_DESCRIPTION, true);
    }
  
    static createDefaultWall(position: Vector2): Wall{
      return new Wall(IdGenerator.generateUniqueId(), Wall.WALL_HP, Wall.WALL_HP, '#', 'Wall', position, true);
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

    clone(): CombatHazard{
      return new Wall(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.solid);
    }
  }
  
  class VolatileCanister extends CombatHazard{
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
      super(id, hp, maxHp, symbol, name, position, solid);
    }

    clone(): CombatHazard{
      return new VolatileCanister(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.solid);
    }
  }

export default CombatHazard;
export { Wall, VolatileCanister };