import { DOMKeyframesDefinition, DynamicAnimationOptions, color } from "framer-motion";
import AnimationDetails from "./AnimationDetails";
import { CombatAnimationNames } from "./CombatAnimationFactory";
import Vector2 from "../utility/Vector2";
import { DirectionsUtility } from "../utility/Directions";
import CSSPropertyGetter from "../utility/CSSPropertyGetter";

class MotionAnimation{
    entityIdToAnimate: number;
    keyframes: DOMKeyframesDefinition[];
    options: DynamicAnimationOptions[]|undefined;

    constructor(entityIdToAnimate:number, keyframes: DOMKeyframesDefinition[], options: DynamicAnimationOptions[]|undefined){
        this.entityIdToAnimate = entityIdToAnimate;
        this.keyframes = keyframes;
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
                xyIncrement.x *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-width")) / 3;
                xyIncrement.y *= parseFloat(CSSPropertyGetter.getProperty("--combat-location-height")) / 3;
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
            case CombatAnimationNames.Block:
                return new MotionAnimation(
                    combatAnimation.entityToAnimateId, 
                    [
                        {color: "yellow", scale: 1.1},
                        {color: CSSPropertyGetter.getProperty("--text-color"), scale: 1},
                    ], 
                    [
                        {duration: combatAnimation.animationLength/2000},
                        {duration: combatAnimation.animationLength/2000}
                    ]
                );
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
            case CombatAnimationNames.Hurt:
                const leftMove:number = parseFloat(CSSPropertyGetter.getProperty("--combat-location-width")) / 10;
                const rightMove:number = -leftMove;
                return new MotionAnimation(
                    combatAnimation.entityToAnimateId, 
                    [
                        {x: leftMove, color: "#ca4d4d"}, 
                        {x: rightMove}, 
                        {x: 0, color: CSSPropertyGetter.getProperty("--text-color")}
                    ], 
                    [
                        {duration: combatAnimation.animationLength/3000},
                        {duration: combatAnimation.animationLength/3000},
                        {duration: combatAnimation.animationLength/3000},
                    ]
                );
            case CombatAnimationNames.Reset:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 0, y:0}], [{duration: 0}]);
            default:
                return new MotionAnimation(combatAnimation.entityToAnimateId, [{x: 0, y:0}], [{duration: 0}]);
        }
    }
}

export {MotionAnimation};
export default CombatAnimationDetailsToMotionAnimation;
