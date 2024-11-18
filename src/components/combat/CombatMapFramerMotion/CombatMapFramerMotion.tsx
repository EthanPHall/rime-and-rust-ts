import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import './CombatMapFramerMotion.css';
import CombatMapLocation from '../CombatMapLocation/CombatMapLocation';
import CombatMapManager from '../../../classes/combat/CombatMapManager';
import Directions from '../../../classes/utility/Directions';
import Vector2 from '../../../classes/utility/Vector2';
import MapUtilities from '../../../classes/utility/MapUtilities';
import CombatMapData from '../../../classes/combat/CombatMapData';
import AreaOfEffect from '../../../classes/combat/AreaOfEffect';
import '../../../css/combat-animations.css';
import { AnimationScope, TargetAndTransition, useAnimate} from 'framer-motion';
import CombatAnimationDetailsToMotionAnimation, { MotionAnimation } from '../../../classes/animation/CombatAnimationDetailsToMotionAnimation';
import CombatAnimationFactory, { CombatAnimationNames } from '../../../classes/animation/CombatAnimationFactory';
import CombatPlayer from '../../../classes/combat/CombatPlayer';
import {motion} from 'framer-motion';
import CSSPropertyGetter from '../../../classes/utility/CSSPropertyGetter';

interface CombatMapProps {
  map: CombatMapData;
  setMap: (map: CombatMapData) => void;
  aoeToDisplay: AreaOfEffect|null;
  scope:AnimationScope<any>;
}

const CombatMapFramerMotion: FC<CombatMapProps> = ({map, setMap, aoeToDisplay, scope}:CombatMapProps) => {
  const pauseAnimInputs = useRef(false);

  const [animationObject, setAnimationObject] = useState<TargetAndTransition>({
    color:[null, CSSPropertyGetter.getProperty("--burn-color-1"), CSSPropertyGetter.getProperty("--burn-color-2")],
    transition: {duration: 3, repeat: Infinity, repeatType: "reverse"}
  });

  useEffect(() => {
    setAnimationObject({
      color:[null, CSSPropertyGetter.getProperty("--burn-color-1"), CSSPropertyGetter.getProperty("--burn-color-2")],
      transition: {duration: 3, repeat: Infinity, repeatType: "reverse"}
    });
  }, [map]);

  function highlightAOE(){
    if(!aoeToDisplay){
      return;
    }

    map.highlightAOE(aoeToDisplay, new Vector2(7, 7));

    setMap(CombatMapData.clone(map));
  }

  function highlightPlayer(){
    const playerLocation:Vector2 = new Vector2(7, 7);
    map.highlightByCoordinates([playerLocation]);

    setMap(CombatMapData.clone(map));
  }

  function positionToId(position: Vector2): string{
    return `combat-location-${position.y*100+position.x}`;
  }

  async function animateSevenSeven(){
    // await animate("#combat-location-707", {x: 10}, { duration: .1 });
    // await animate("#combat-location-707", {x: 0}, { duration: .15 });
    // await animate("#combat-location-707", {x: 0, x:10}, { duration: .25 });
    // await animate("#combat-location-707","x: 24", { duration: .35 });

    // const motionAnimation:MotionAnimation = CombatAnimationDetailsToMotionAnimation.convert(CombatAnimationFactory.createAnimation(CombatAnimationNames.Bump, Directions.RIGHT, 707));
    // const positionOfEntityToAnimate:Vector2 = map.getEntityById(DEBUG_player().id).position;

    // for(let i = 0; i < motionAnimation.animation.length; i++){
    //   await animate(`#${positionToId(positionOfEntityToAnimate)}`, motionAnimation.animation[i], motionAnimation.options ? motionAnimation.options[i]:undefined);
    // }
  }

  return (
    <>
      {/* <button className='highlight-button' onClick={highlightAOE}>Highlight</button> */}
      {/* <button className='highlight-button' onClick={highlightPlayer}>Highlight Player</button> */}
      {/* <button className='highlight-button' onClick={animateSevenSeven}>Animate (7,7)</button> */}
      {/* <button className='log-button' onClick={logLocationData}>Log</button> */}
      <div ref={scope} id="-1" className="combat-map" data-testid="combat-map">
        {map.locations.map((row, i) => {
          return (
            <div key={"combat-map-" + row + "-" + i} className="combat-map-row">
              {row.map((location, j) => {
                return (
                  <motion.span 
                    // animate={animationObject}

                    onClick={() => {console.log(location)}} 
                    id={positionToId(new Vector2(j, i))} 
                    className={`combat-map-location ${location.highlight ? "highlight" : ""} ${location.name.split(" ")[0] == "invisible-wall" ? "invisible" : ""}`} 
                    key={"combat-map-location:" + location.y*10+location.x}>
                      {location.symbol}
                  </motion.span>
                );
              })}
            </div>
          );
        }
      )}
      </div>
    </>
  );
}

export default CombatMapFramerMotion;
