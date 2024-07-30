import { useEffect, useRef, useState } from "react";
import { MapLocationData } from "../../data/map-location-data/MapLocationDataHandler";
import IAnimator from "../../classes/animation/IAnimator";
import CombatAnimationFactory, { CombatAnimationNames } from "../../classes/animation/CombatAnimationFactory";
import Directions from "../../classes/utility/Directions";
import CombatPlayer from "../../classes/combat/CombatPlayer";
import CombatMapData from "../../classes/combat/CombatMapData";
import CombatHazard from "../../classes/combat/CombatHazard";
import AnimationDetails from "../../classes/animation/AnimationDetails";
import { start } from "repl";
import { AnimationPlaybackControls, AnimationSequence, SequenceOptions, ValueAnimationTransition } from "framer-motion";
import CombatEntity from "../../classes/combat/CombatEntity";

class ImprovedMotionAnimation{
    entityToAnimate: CombatEntity;
    to: any; 
    options: ValueAnimationTransition<any> | undefined;

    constructor(entityToAnimate: CombatEntity, to: any, options?: ValueAnimationTransition<any> | undefined){
        this.entityToAnimate = entityToAnimate;
        this.to = to;
        this.options = options;
    }
}

function useCombatHazardAnimations(
    map: CombatMapData, 
    animator: IAnimator, 
    getPlayer:() => CombatPlayer,
    hazards:CombatHazard[],
    isExecutingActions:()=> boolean,
    mapAnimate:(from: any, to: any, options?: ValueAnimationTransition<any> | undefined) => AnimationPlaybackControls
){
    const animationsToPlay = useRef<AnimationDetails[][]>([]);
    // useState<Promise<void>>(startHazardAnimations());
    const animationPlaybackControls = useRef<AnimationPlaybackControls[]>([]);

    useEffect(() => {
        // startHazardAnimations();
    },[]);
    
    useEffect(() => {
        
        hazards.forEach(hazard => {
                const currentAnimDetails:ImprovedMotionAnimation|null = hazard.getDefaultAnimation();
                if(currentAnimDetails){
                    mapAnimate(map.positionToCSSIdString(hazard.position), currentAnimDetails.to, currentAnimDetails.options);
                }
            });
      }, [map]);

      async function startHazardAnimations():Promise<void>{
          console.log("Starting hazard animations");
          
          while(true){
            if(animationsToPlay.current.length === 0 || isExecutingActions()){
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            else{
                await animator.animate(animationsToPlay.current);
            }
        }
      }
}

export default useCombatHazardAnimations;
export {ImprovedMotionAnimation};