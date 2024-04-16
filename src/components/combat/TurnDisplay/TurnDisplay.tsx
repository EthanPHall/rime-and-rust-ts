import React, { FC } from 'react';
import './TurnDisplay.css';

interface TurnDisplayProps {}

const TurnDisplay: FC<TurnDisplayProps> = () => (
  <div className="turn-display" data-testid="turn-display">
    Turn:
    <div className='turn'>@</div>
  </div>
);

export default TurnDisplay;
