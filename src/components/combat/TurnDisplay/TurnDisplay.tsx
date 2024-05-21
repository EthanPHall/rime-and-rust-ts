import React, { FC } from 'react';
import './TurnDisplay.css';
import TurnTaker from '../../../classes/combat/TurnTaker';

interface TurnDisplayProps {
  currentTurnTaker: TurnTaker;
}

const TurnDisplay: FC<TurnDisplayProps> = ({currentTurnTaker}: TurnDisplayProps) => {
  return (
    <div className="turn-display" data-testid="turn-display">
      Turn:
      <div className="turn-taker" data-testid="turn-taker">
        {currentTurnTaker.combatEntity.symbol}
      </div>
    </div>
  );
}

export default TurnDisplay;
