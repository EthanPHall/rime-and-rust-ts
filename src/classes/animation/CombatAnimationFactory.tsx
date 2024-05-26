import exp from "constants";
import Directions from "../utility/Directions";
import CombatAnimationDetails from "./AnimationDetails";

enum CombatAnimationNames {
    Move = "Move",
    Attack = "Attack",
    Block = "Block",
    None = "None",
}

class CombatAnimationFactory{
    static createAnimation(animationName: string, direction:Directions, entityToAnimateId:number): CombatAnimationDetails {
        switch(animationName){
            case CombatAnimationNames.Move:
                return new CombatAnimationDetails(CombatAnimationNames.Move, 3500, direction, entityToAnimateId);
            case CombatAnimationNames.Attack:
                return new CombatAnimationDetails(CombatAnimationNames.Attack, 350, direction, entityToAnimateId);
            case CombatAnimationNames.Block:
                return new CombatAnimationDetails(CombatAnimationNames.Block, 350, direction, entityToAnimateId);
            default:
                return new CombatAnimationDetails(CombatAnimationNames.None, 0, direction, entityToAnimateId);
        }
    }
}

export default CombatAnimationFactory;
export {CombatAnimationNames};