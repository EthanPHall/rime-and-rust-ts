import IdGenerator from "../utility/IdGenerator";
import MapUtilities from "../utility/MapUtilities";
import Vector2 from "../utility/Vector2";
import CombatEntity from "./CombatEntity";

abstract class CombatHazard extends CombatEntity{
    solid: boolean;
    intangible: boolean;
    onlyDisplayOneInSidebar: boolean;
    previousEntityOnThisSpace: CombatEntity | null = null;
  
    constructor(
      id: number, 
      hp: number, 
      maxHp: number, 
      symbol: string, 
      name: string, 
      position: Vector2, 
      solid: boolean, 
      description: string = "", 
      onlyDisplayOneInSidebar: boolean = false,
      intangible: boolean = false
    ){
      super(id, hp, maxHp, symbol, name, position, description);
      this.solid = solid;
      this.onlyDisplayOneInSidebar = onlyDisplayOneInSidebar;
      this.intangible = intangible;
    }

    isWalkable(): boolean {
      return this.intangible;
    }

    protected newEntityIsDifferent(newEntity: CombatEntity): boolean{
      return newEntity.id !== this.previousEntityOnThisSpace?.id;
    }

    abstract handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null;
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

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      this.previousEntityOnThisSpace = newEntity;
      return null;
    }
  }
  
  class VolatileCanister extends CombatHazard{
    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean){
      super(id, hp, maxHp, symbol, name, position, solid);
    }

    clone(): CombatHazard{
      return new VolatileCanister(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.solid);
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      this.previousEntityOnThisSpace = newEntity;
      return null;
    }
  }

  class BurningFloor extends CombatHazard{
    static DESCRIPTION:string = 'Sturdy walls. Click a specific wall in the map to see its health.';

    damage: number;

    constructor(id:number, hp: number, maxHp: number, symbol: string, name: string, position: Vector2, solid: boolean, damage: number = 5){
      super(id, hp, maxHp, symbol, name, position, solid, BurningFloor.DESCRIPTION, true, true);
      this.damage = damage;
    }

    clone(): CombatHazard{
      return new BurningFloor(this.id, this.hp, this.maxHp, this.symbol, this.name, this.position, this.solid, this.damage);
    }

    handleNewEntityOnThisSpace(newEntity: CombatEntity|null): CombatEntity|null {
      let updatedEntity:CombatEntity|null = null;
      
      if(newEntity !== null && this.newEntityIsDifferent(newEntity)){
        updatedEntity = newEntity.clone();
        updatedEntity.takeDamage(this.damage);
      }
      
      this.previousEntityOnThisSpace = newEntity;
      return updatedEntity;
    }
  }

export default CombatHazard;
export { Wall, VolatileCanister, BurningFloor};