import CombatAction from "../CombatAction";

class Reaction {
  action:CombatAction; 
  priority:number;

  constructor(action: CombatAction, priority: number){
    this.action = action;
    this.priority = priority;
  }
};

export default Reaction;