import { AnimationPlaybackControls, AnimationScope, DOMKeyframesDefinition, DynamicAnimationOptions, ElementOrSelector } from "framer-motion";
import AnimationDetails from "./AnimationDetails";
import CombatAnimationDetailsToMotionAnimation, { MotionAnimation } from "./CombatAnimationDetailsToMotionAnimation";
import IAnimator, { IAnimationCleanup } from "./IAnimator";
import Vector2 from "../utility/Vector2";
import CombatMapData from "../combat/CombatMapData";
import CombatAnimationFactory, { CombatAnimationNames } from "./CombatAnimationFactory";
import Directions from "../utility/Directions";

class MotionCombatAnimator implements IAnimator{
    private getMapData: () => CombatMapData;
    private mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls;
    constructor(getMapData: () => CombatMapData, mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls){
        this.mapAnimate = mapAnimate;
        this.getMapData = getMapData;
    }

    animate(animationDetails: AnimationDetails[][]): Promise<IAnimationCleanup>{
        const animationSets: MotionAnimation[][] = animationDetails.map((animationSet) => {
            return animationSet.map((animation) => CombatAnimationDetailsToMotionAnimation.convert(animation));
        });
        const mapData:CombatMapData = this.getMapData();
        
        return new Promise<IAnimationCleanup>(async (resolve) => {
            let keyFrameIndex = 0;
            // console.log("Sets",animationSets);

            //i increments when all animations in the set are complete
            for(let setIndex = 0; setIndex < animationSets.length;){
                const currentAnimationSet: MotionAnimation[] = animationSets[setIndex];
                const playbackControls: AnimationPlaybackControls[] = [];

                for(let animationIndex = 0; animationIndex < currentAnimationSet.length; animationIndex++){
                    const currentAnimation: MotionAnimation = currentAnimationSet[animationIndex];
                    const positionToAnimate: Vector2 = currentAnimation.positionToAnimate ? currentAnimation.positionToAnimate : mapData.getEntityById(currentAnimation.entityIdToAnimate).position; 
                    
                    // console.log("current animation",currentAnimation);

                    if(keyFrameIndex < currentAnimation.keyframes.length){
                        playbackControls.push(
                            this.mapAnimate(mapData.positionToCSSIdString(positionToAnimate), currentAnimation.keyframes[keyFrameIndex], currentAnimation.options?.[keyFrameIndex])
                        );
                    }
                }

                if(playbackControls.length > 0){
                    // console.log("Should be waiting",playbackControls);
                    await Promise.all(playbackControls);
                    keyFrameIndex++;
                    // console.log("KeyframeIndex++",keyFrameIndex);
                }
                else{
                    setIndex++;
                    // console.log("setIndex++",setIndex);
                    keyFrameIndex = 0;
                }
            }
            
            // console.log("------DONE------");
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
                    mapAnimate(mapData.positionToCSSIdString(new Vector2(rowIndex, columnIndex)), resetAnimation.keyframes[0], resetAnimation.options?.[0]);
                });
            });

            resolve();
        });
    }
}

export default MotionCombatAnimator;