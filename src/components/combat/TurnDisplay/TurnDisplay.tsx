import React, { FC, useEffect } from 'react';
import './TurnDisplay.css';
import TurnTaker from '../../../classes/combat/TurnTaker';
import { useAnimate } from 'framer-motion';

interface TurnDisplayProps {
  currentTurnTaker: TurnTaker|null;
}

const TurnDisplay: FC<TurnDisplayProps> = ({currentTurnTaker}: TurnDisplayProps) => {
  const [scope, animate] = useAnimate();
  const [turnTakerToDisplay, setTurnTakerToDisplay] = React.useState<TurnTaker|null>(currentTurnTaker);

  useEffect(() => {
    if(currentTurnTaker){
      animate(
        scope.current,
        {
          x: -30,
          opacity: 0,
        },
        {
          duration: .5,
        }
      ).then(() => {
        setTurnTakerToDisplay(currentTurnTaker);
      });
    }
  }, [currentTurnTaker]);

  useEffect(() => {
    if(turnTakerToDisplay){      
      animate(
        scope.current,
        {
          x: [30, 0],
          opacity: [0, 1],
        },
        {
          duration: .5,
        }
      );
    }
  }, [turnTakerToDisplay]);
  
  return (
    <div className="turn-display" data-testid="turn-display">
      Turn:
      <div ref={scope} className="turn-taker" data-testid="turn-taker">
        {turnTakerToDisplay?.combatEntity.symbol}
      </div>
    </div>
  );
}

export default TurnDisplay;
