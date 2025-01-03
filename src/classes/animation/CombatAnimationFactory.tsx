import exp from "constants";
import Directions from "../utility/Directions";
import AnimationDetails from "./AnimationDetails";
import Vector2 from "../utility/Vector2";

enum CombatAnimationNames {
    Move = "Move",
    Attack = "Attack",
    Swipe = "Swipe",
    Block = "Block",
    Bump = "Bump",
    ShortBump = "ShortBump",
    Reset = "Reset",
    Hurt = "Hurt",
    Grapple = "Grapple",
    Psychic = "Psychic",
    Pyro = "Pyro",
    Burn = "Burn",
    Explosion = "Explosion",
    None = "None",
}

class CombatAnimationFactory{
    static createAnimation(animationName: string, direction:Directions, entityToAnimateId:number, dontPlayIfLast:boolean = false, positionToAnimate:Vector2|null = null): AnimationDetails {
        switch(animationName){
            case CombatAnimationNames.Move:
                return new AnimationDetails(CombatAnimationNames.Move, 250, direction, entityToAnimateId);
            case CombatAnimationNames.Attack:
                return new AnimationDetails(CombatAnimationNames.Attack, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Swipe:
                return new AnimationDetails(CombatAnimationNames.Swipe, 300, direction, entityToAnimateId);
            case CombatAnimationNames.Block:
                return new AnimationDetails(CombatAnimationNames.Block, 250, direction, entityToAnimateId);
            case CombatAnimationNames.Bump:
                return new AnimationDetails(CombatAnimationNames.Bump, 200, direction, entityToAnimateId);
            case CombatAnimationNames.ShortBump:
                return new AnimationDetails(CombatAnimationNames.ShortBump, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Hurt:
                return new AnimationDetails(CombatAnimationNames.Hurt, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Grapple:
                return new AnimationDetails(CombatAnimationNames.Grapple, 200, direction, entityToAnimateId);
            case CombatAnimationNames.Psychic:
                return new AnimationDetails(CombatAnimationNames.Psychic, 200, direction, entityToAnimateId, dontPlayIfLast, positionToAnimate);
            case CombatAnimationNames.Pyro:
                return new AnimationDetails(CombatAnimationNames.Pyro, 300, direction, entityToAnimateId, dontPlayIfLast, positionToAnimate);
            case CombatAnimationNames.Burn:
                return new AnimationDetails(CombatAnimationNames.Burn, 1000, direction, entityToAnimateId, dontPlayIfLast, positionToAnimate);
            case CombatAnimationNames.Explosion:
                return new AnimationDetails(CombatAnimationNames.Explosion, 1000, direction, entityToAnimateId, dontPlayIfLast, positionToAnimate);
            case CombatAnimationNames.Reset:
                return new AnimationDetails(CombatAnimationNames.Reset, 0, direction, entityToAnimateId);
            default:
                return new AnimationDetails(CombatAnimationNames.None, 0, direction, entityToAnimateId);
        }
    }
}

export default CombatAnimationFactory;
export {CombatAnimationNames};