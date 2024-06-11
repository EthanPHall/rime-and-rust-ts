import { useEffect, useRef, useState } from "react";
import { MapLocationData } from "../data/map-location-data/MapLocationDataHandler";
import IAnimator from "../classes/animation/IAnimator";
import CombatAnimationFactory, { CombatAnimationNames } from "../classes/animation/CombatAnimationFactory";
import Directions from "../classes/utility/Directions";
import CombatPlayer from "../classes/combat/CombatPlayer";
import CombatMapData from "../classes/combat/CombatMapData";
import CombatHazard from "../classes/combat/CombatHazard";
import AnimationDetails from "../classes/animation/AnimationDetails";
import { start } from "repl";

function useCombatHazardAnimations(
    map: CombatMapData, 
    animator: IAnimator, 
    getPlayer:() => CombatPlayer,
    hazards:CombatHazard[],
    isTurnTakerPlayer:()=> boolean
){
    const animationsToPlay = useRef<AnimationDetails[][]>([]);
    useState<Promise<void>>(startPermanentAnimations());
    
    useEffect(() => {
        animationsToPlay.current = [[]];

        hazards.forEach(hazard => {
            const currentAnimDetails:AnimationDetails|null = hazard.getDefaultAnimation();
            if(currentAnimDetails){
                animationsToPlay.current[0].push(currentAnimDetails);
            }
        });
      }, [map]);

      async function startPermanentAnimations():Promise<void>{
        while(true){
            if(animationsToPlay.current.length === 0){
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            else{
                await animator.animate(animationsToPlay.current);
            }
        }
      }
}

export default useCombatHazardAnimations;