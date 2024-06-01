import exp from "constants";
import Directions from "../utility/Directions";
import AnimationDetails from "./AnimationDetails";

enum CombatAnimationNames {
    Move = "Move",
    Attack = "Attack",
    Block = "Block",
    Bump = "Bump",
    Reset = "Reset",
    Hurt = "Hurt",
    None = "None",
}

class CombatAnimationFactory{
    private static createAltBump: boolean;
    
    static createAnimation(animationName: string, direction:Directions, entityToAnimateId:number): AnimationDetails {
        switch(animationName){
            case CombatAnimationNames.Move:
                return new AnimationDetails(CombatAnimationNames.Move, 250, direction, entityToAnimateId);
            case CombatAnimationNames.Attack:
                return new AnimationDetails(CombatAnimationNames.Attack, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Block:
                return new AnimationDetails(CombatAnimationNames.Block, 300, direction, entityToAnimateId);
            case CombatAnimationNames.Bump:
                return new AnimationDetails(CombatAnimationNames.Bump, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Hurt:
                return new AnimationDetails(CombatAnimationNames.Hurt, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Reset:
                return new AnimationDetails(CombatAnimationNames.Reset, 0, direction, entityToAnimateId);
            default:
                return new AnimationDetails(CombatAnimationNames.None, 0, direction, entityToAnimateId);
        }
    }
}

export default CombatAnimationFactory;
export {CombatAnimationNames};