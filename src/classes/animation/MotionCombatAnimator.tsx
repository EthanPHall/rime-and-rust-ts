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
        if(animationDetails.length === 0){
            return Promise.resolve({cleanupAnimations: this.cleanupAnimations, args: [this.getMapData, this.mapAnimate]});
        }

        const animationSets: MotionAnimation[][] = animationDetails.map((animationSet) => {
            return animationSet.map((animation) => CombatAnimationDetailsToMotionAnimation.convert(animation));
        });
        const mapData:CombatMapData = this.getMapData();
        
        return new Promise<IAnimationCleanup>(async (resolve) => {
            let keyFrameIndex = 0;

            //i increments when all animations in the set are complete
            for(let animationSetIndex = 0; animationSetIndex < animationSets.length;){
                const currentAnimationSet: MotionAnimation[] = animationSets[animationSetIndex];
                const playbackControls: AnimationPlaybackControls[] = [];

                for(let animationIndex = 0; animationIndex < currentAnimationSet.length; animationIndex++){
                    const currentAnimation: MotionAnimation = currentAnimationSet[animationIndex];
                    const positionToAnimate: Vector2|undefined = currentAnimation.positionToAnimate ? currentAnimation.positionToAnimate : mapData.getEntityById(currentAnimation.entityIdToAnimate)?.position; 

                    if(!positionToAnimate){
                        continue;
                    }

                    if(keyFrameIndex < currentAnimation.keyframes.length){
                        playbackControls.push(
                            this.mapAnimate(mapData.positionToCSSIdString(new Vector2(positionToAnimate.y, positionToAnimate.x)), currentAnimation.keyframes[keyFrameIndex], currentAnimation.options?.[keyFrameIndex])
                        );
                    }
                }

                if(playbackControls.length > 0){
                    await Promise.all(playbackControls);
                    keyFrameIndex++;
                }
                else{
                    animationSetIndex++;
                    keyFrameIndex = 0;
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
                    mapAnimate(mapData.positionToCSSIdString(new Vector2(rowIndex, columnIndex)), resetAnimation.keyframes[0], resetAnimation.options?.[0]);
                });
            });

            resolve();
        });
    }
}

export default MotionCombatAnimator;