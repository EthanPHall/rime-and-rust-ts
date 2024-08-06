import { useContext, useEffect, useRef, useState } from "react";
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
import Vector2 from "../../classes/utility/Vector2";
import { SettingsContext } from "../../context/misc/SettingsContext";

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

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
        // startHazardAnimations();
    },[]);
    
    useEffect(() => {
        
        hazards.forEach(hazard => {
                const currentAnimDetails:ImprovedMotionAnimation|null = hazard.getDefaultAnimation();
                if(currentAnimDetails){
                    mapAnimate(map.positionToCSSIdString(new Vector2(hazard.position.y, hazard.position.x)), currentAnimDetails.to, currentAnimDetails.options);
                }
            });
      }, [map]);

      async function startHazardAnimations():Promise<void>{
          while(true){
            if(animationsToPlay.current.length === 0 || isExecutingActions()){
                await new Promise((resolve) => setTimeout(resolve, settingsContext.settingsManager.getCorrectTiming(1000)));
            }
            else{
                await animator.animate(animationsToPlay.current);
            }
        }
      }
}

export default useCombatHazardAnimations;
export {ImprovedMotionAnimation};