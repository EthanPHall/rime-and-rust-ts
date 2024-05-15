import Directions from "../utility/Directions";

class CombatAction{
    name: string;
    directional: boolean;
    direction: Directions; 
    constructor(name: string, directional: boolean, direction: Directions = Directions.NONE){    
      this.name = name;
      this.directional = directional;
      this.direction = direction;
    }
  
    static clone(action:CombatAction) : CombatAction{
      return new CombatAction(action.name, action.directional, action.direction);
    }
  
    dataToObject() : Object{
      return {
        name: this.name,
        directional: this.directional,
        direction: this.direction
      };
    }

    execute(): void{
      console.log('Executing action');
    }

    areEquivalent(action: CombatAction): boolean {
      return this.name === action.name && this.direction === action.direction;
    }

    areSameType(action: CombatAction): boolean {
      return this.name === action.name;
    }
  }

  class CombatActionWithUses {
    action: CombatAction;
    uses: number;
    maxUses: number;
  
    constructor(action: CombatAction, maxUses: number) {
      this.action = action;
      this.maxUses = maxUses;
      this.uses = maxUses;
    }
  }

  class CombatActionWithRepeat {
    combatAction: CombatAction;
    repeat: number;
  
    constructor(combatAction: CombatAction) {
      this.combatAction = combatAction;
      this.repeat = 1;
    }
    incrementRepeat(): void{
      this.repeat++;
    }
    decrementRepeat(): void{
      this.repeat--;
    }
    areEquivalent(action: CombatActionWithRepeat): boolean {
      return this.combatAction.areEquivalent(action.combatAction);
    }
  }  
  
  class Attack extends CombatAction {
    name = 'Attack';
    direction = Directions.RIGHT;
  
    constructor() {
      super('Attack', true);
    }
  
    execute() {
      console.log('Attacking');
    }
  }
  class Block extends  CombatAction {
    name = 'Block';
  
    constructor() {
      super('Block', false);
    }
  
    execute() {
      console.log('Blocking');
    }
  }

  class Move extends  CombatAction {
    name = 'Move';
  
    constructor(direction: Directions = Directions.NONE) {
      super('Move', true, direction);
    }
  
    execute() {
      console.log(`Moving ${this.direction}`);
    }
  }
  
export default CombatAction;
export { Attack, Block, Move, CombatActionWithRepeat, CombatActionWithUses};
