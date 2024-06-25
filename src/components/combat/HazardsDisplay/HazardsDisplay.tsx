import React, { FC, PropsWithChildren } from 'react';
import './HazardsDisplay.css';
import CombatHazard from '../../../classes/combat/CombatHazard';

interface HazardsDisplayProps {
  hazards: CombatHazard[];
  showCard: (title: string, description: string) => void;
}

const HazardEntry: FC<{hazard: CombatHazard, onClick: () => void}> = ({hazard, onClick}) => {
  return (
    <div className="hazard-entry" data-testid="hazard-entry" onClick={onClick}>
      <span>{`${hazard.symbol}`}</span>
      <span>{!hazard.onlyDisplayOneInSidebar && `: ${hazard.getHp()}/${hazard.maxHp}`}</span>
    </div>
  );
}

const HazardsDisplay: FC<HazardsDisplayProps> = ({hazards, showCard}: HazardsDisplayProps) => {
  const toDisplay: CombatHazard[] = [];
  hazards.forEach(hazard => {
    const alreadyDisplayed = toDisplay.find(displayed => displayed.name === hazard.name);
    if (!alreadyDisplayed || !alreadyDisplayed.onlyDisplayOneInSidebar) {
      toDisplay.push(hazard);
    }
  });

  return (
    <div className="hazards-display" data-testid="hazards-display">
      {
        toDisplay.map((hazard, index) => (
          <HazardEntry key={index} hazard={hazard} onClick={() => showCard(hazard.name, hazard.description)} />
        ))
      }
    </div>
  );
}

export default HazardsDisplay;
