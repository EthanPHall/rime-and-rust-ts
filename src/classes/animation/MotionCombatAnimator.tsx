import { AnimationPlaybackControls, AnimationScope, DOMKeyframesDefinition, DynamicAnimationOptions, ElementOrSelector } from "framer-motion";
import AnimationDetails from "./AnimationDetails";
import CombatAnimationDetailsToMotionAnimation, { MotionAnimation } from "./CombatAnimationDetailsToMotionAnimation";
import IAnimator, { IAnimationCleanup } from "./IAnimator";
import Vector2 from "../utility/Vector2";
import CombatMapData from "../combat/CombatMapData";
import CombatAnimationFactory, { CombatAnimationNames } from "./CombatAnimationFactory";
import Directions from "../utility/Directions";
import { CombatEndState } from "../../components/combat/CombatParent/CombatParent";

class MotionCombatAnimator implements IAnimator{
    private getMapData: () => CombatMapData;
    private mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls;
    private combatEndStateRef: React.MutableRefObject<CombatEndState>;
    constructor(
        getMapData: () => CombatMapData,
        mapAnimate: (value: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: DynamicAnimationOptions | undefined) => AnimationPlaybackControls,
        combatEndStateRef: React.MutableRefObject<CombatEndState>
    ){
        this.mapAnimate = mapAnimate;
        this.getMapData = getMapData;
        this.combatEndStateRef = combatEndStateRef;
    }

    animate(animationDetails: AnimationDetails[][]): Promise<IAnimationCleanup>{
        if(animationDetails.length === 0 || this.combatEndStateRef.current !== CombatEndState.UNDECIDED){
            return Promise.resolve({cleanupAnimations: this.cleanupAnimations, args: [this.getMapData, this.mapAnimate]});
        }

        const animationSets: MotionAnimation[][] = animationDetails.map((animationSet) => {
            return animationSet.map((animation) => CombatAnimationDetailsToMotionAnimation.convert(animation));
        });
        const mapData:CombatMapData = this.getMapData();

        return new Promise<IAnimationCleanup>(async (resolve) => {
            let keyFrameIndex = 0;


            // console.log("Animation Sets", animationSets);
            //i increments when all animations in the set are complete
            for(let animationSetIndex = 0; animationSetIndex < animationSets.length;){
                const currentAnimationSet: MotionAnimation[] = animationSets[animationSetIndex];
                const playbackControls: AnimationPlaybackControls[] = [];

                // console.log("Current Animation Set", currentAnimationSet);

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
                    // Adding any sort of delay in addition to the playbackControls promise actually breaks this for some reason
                    // await new Promise<void>((resolve) => {
                    //     setTimeout(() => {console.log("Resolved"); resolve()}, 200);
                    // });

                    // Theres an issue here where, if the player blows up a volatile can and is in the radius,
                    // this promise fails to resolve. I don't know why, and it isn't consistent.

                    //Well, I was able to come up with a bandaid fix that seems to work. I added a fallback promise that resolves 
                    //after a little while (I don't expect any individual animation section to last longer than the fallback),
                    //so that if/when the main promise fails to resolve, the fallback promise will resolve and the animation will continue. It looks wonky, but it works.

                    //NOTE: In the future, if you're ever wondering why the animation gets stuck for a sec in certain cases, this is why.
                    const normalPromise = Promise.all(playbackControls);
                    const fallbackPromise = new Promise<void>((resolve) => {
                        setTimeout(() => {resolve()}, 700);
                    });
                    await Promise.race([normalPromise, fallbackPromise]);
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