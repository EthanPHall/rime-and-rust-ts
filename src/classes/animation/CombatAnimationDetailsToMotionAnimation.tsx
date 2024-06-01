import { DOMKeyframesDefinition, DynamicAnimationOptions } from "framer-motion";
import AnimationDetails from "./AnimationDetails";
import { CombatAnimationNames } from "./CombatAnimationFactory";
import Vector2 from "../utility/Vector2";
import { DirectionsUtility } from "../utility/Directions";
import CSSPropertyGetter from "../utility/CSSPropertyGetter";

class MotionAnimation{
    entityIdToAnimate: number;
    animation: DOMKeyframesDefinition[];
    options: DynamicAnimationOptions[]|undefined;

    constructor(entityIdToAnimate:number, animation: DOMKeyframesDefinition[], options: DynamicAnimationOptions[]|undefined){
        this.entityIdToAnimate = entityIdToAnimate;
        this.animation = animation;
        this.options = options;

    }
}

class CombatAnimationDetailsToMotionAnimation{
    static convert(combatAnimation: AnimationDetails): MotionAnimation{
        const xyIncrement:Vector2 = DirectionsUtility.getVectorFromDirection(combatAnimation.direction);
        
        switch(combatAnimation.animationName){
            case CombatAnimationNames.Move:
                xyIncrement.x *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-width"));
                xyIncrement.y *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-height"));
                return new MotionAnimation(
                    combatAnimation.entityToAnimateId, 
                    [
                        {x: xyIncrement.x, y: xyIncrement.y}                    ],
                    [
                        {duration: combatAnimation.animationLength/1000}
                    ]);
            case CombatAnimationNames.Attack:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 10}], [{duration: combatAnimation.animationLength/1000}]);
            case CombatAnimationNames.Block:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 10}], [{duration: combatAnimation.animationLength/1000}]);
            case CombatAnimationNames.Bump:
                xyIncrement.x *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-width")) / 2;
                xyIncrement.y *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-height")) / 2;
                return new MotionAnimation(
                    combatAnimation.entityToAnimateId, 
                    [
                        {x: xyIncrement.x, y: xyIncrement.y}, 
                        {x: 0, y: 0}
                    ],
                    [
                        {duration: combatAnimation.animationLength/2000},
                        {duration: combatAnimation.animationLength/2000}
                    ]);
            case CombatAnimationNames.Reset:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 0, y:0}], [{duration: 0}]);
            default:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 0, y:0}], [{duration: 0}]);
        }
    }
}

export {MotionAnimation};
export default CombatAnimationDetailsToMotionAnimation;
