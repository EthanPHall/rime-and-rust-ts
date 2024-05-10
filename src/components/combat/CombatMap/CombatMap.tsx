import React, { FC, useEffect, useMemo, useState } from 'react';
import './CombatMap.css';
import CombatMapLocation from '../CombatMapLocation/CombatMapLocation';
import CombatMapManager from '../../../classes/combat/CombatMapManager';

interface CombatMapProps {combatMapManager: CombatMapManager}

const CombatMap: FC<CombatMapProps> = (props:CombatMapProps) => {

  const [map, setMap] = useState(props.combatMapManager.GetMap());
  useEffect(() => {
    props.combatMapManager.BuildMap();
    setMap(props.combatMapManager.GetMap());

    console.log(map.length);
  }, []); 

  return (
    <div className="combat-map" data-testid="combat-map">
      {map.map((row, y) => {
        return (
          <div key={`combat-map-row-${y}`} className="combat-map-row">
            {row.map((location, x) => {
              return (
                <CombatMapLocation key={`combat-map-location-(${x},${y})`} symbol={location.symbol}></CombatMapLocation>
              );
            })}
          </div>
        );
      })}
    </div>  
  );
}

export default CombatMap;
