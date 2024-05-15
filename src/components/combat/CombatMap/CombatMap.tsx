import React, { FC, useEffect, useMemo, useState } from 'react';
import './CombatMap.css';
import CombatMapLocation from '../CombatMapLocation/CombatMapLocation';
import CombatMapManager from '../../../classes/combat/CombatMapManager';
import Directions from '../../../classes/utility/Directions';
import Vector2 from '../../../classes/utility/Vector2';
import MapUtilities from '../../../classes/utility/MapUtilities';
import CombatMapData from '../../../classes/combat/CombatMapData';
import AreaOfEffect from '../../../classes/combat/AreaOfEffect';

interface CombatMapProps {
  map: CombatMapData;
  setMap: (map: CombatMapData) => void;
  aoeToDisplay: AreaOfEffect|null;
}

const CombatMap: FC<CombatMapProps> = ({map, setMap, aoeToDisplay}:CombatMapProps) => {
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

  return (
    <>
      <button className='highlight-button' onClick={highlightAOE}>Highlight</button>
      <button className='highlight-button' onClick={highlightPlayer}>Highlight Player</button>
      {/* <button className='log-button' onClick={logLocationData}>Log</button> */}
      <div className="combat-map" data-testid="combat-map">
        {map.locations.map((row, i) => {
          return (
            <div key={"combat-map-" + row + "-" + i} className="combat-map-row">
              {row.map((location, j) => {
                return (
                  <span className={`combat-map-location ${location.highlight ? "highlight" : ""}`} key={"combat-map-location:"+location.id}>{location.symbol}</span>
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

export default CombatMap;
