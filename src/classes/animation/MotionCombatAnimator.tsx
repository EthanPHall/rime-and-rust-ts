import { AnimationPlaybackControls, AnimationScope, DOMKeyframesDefinition, DynamicAnimationOptions, ElementOrSelector } from "framer-motion";
import AnimationDetails from "./AnimationDetails";
import CombatAnimationDetailsToMotionAnimation, { MotionAnimation } from "./CombatAnimationDetailsToMotionAnimation";
import IAnimator, { IAnimationCleanup } from "./IAnimator";
import Vector2 from "../utility/Vector2";
import CombatMapData from "../combat/CombatMapData";
import CombatAnimationFactory, { CombatAnimationNames } from "./CombatAnimationFactory";
import Directions from "../utility/Directions";

class MotionCombatAnimator implements IAnimator{
    // private setAnimationList:(newAnimations: MotionAnimation[]) => void;

    // constructor(setAnimationList:(newAnimations: MotionAnimation[]) => void){
    //     this.setAnimationList = setAnimationList;
    // }

    private getMapData: () => CombatMapData;
    private mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls;
    constructor(getMapData: () => CombatMapData, mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls){
        this.mapAnimate = mapAnimate;
        this.getMapData = getMapData;
    }

    animate(animationDetails: AnimationDetails[]): Promise<IAnimationCleanup>{
        const motionsAnimations: MotionAnimation[] = animationDetails.map((animation) => {return CombatAnimationDetailsToMotionAnimation.convert(animation)});
        const mapData:CombatMapData = this.getMapData();
        
        return new Promise<IAnimationCleanup>(async (resolve) => {
            for(let i = 0; i < motionsAnimations.length; i++){
                const currentAnimation: MotionAnimation = motionsAnimations[i];
                const positionOfEntityToAnimate: Vector2 = mapData.getEntityById(currentAnimation.entityIdToAnimate).position; 
                
                for(let j = 0; j < currentAnimation.animation.length; j++){
                    await this.mapAnimate(mapData.positionToCSSIdString(positionOfEntityToAnimate), currentAnimation.animation[j], currentAnimation.options?.[j]);
                }
            }
            
            resolve({cleanupAnimations: this.cleanupAnimations, args: [this.getMapData, this.mapAnimate]});
        });
    }
    
    cleanupAnimations(getMapData: () => CombatMapData, mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls): Promise<void>{
        const mapData:CombatMapData = getMapData();
        const resetAnimation:MotionAnimation = CombatAnimationDetailsToMotionAnimation.convert(
            CombatAnimationFactory.createAnimation(CombatAnimationNames.Reset, Directions.NONE, -1)
        )

        return new Promise((resolve) => {
            mapData.locations.forEach((row, rowIndex) => {
                row.forEach((location, columnIndex) => {
                    mapAnimate(mapData.positionToCSSIdString(new Vector2(rowIndex, columnIndex)), resetAnimation.animation[0], resetAnimation.options?.[0]);
                });
            });

            resolve();
        });
    }
}

export default MotionCombatAnimator;