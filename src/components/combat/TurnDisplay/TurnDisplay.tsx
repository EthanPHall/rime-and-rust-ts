import React, { FC } from 'react';
import './TurnDisplay.css';

interface TurnDisplayProps {}

const TurnDisplay: FC<TurnDisplayProps> = () => (
  <div className="TurnDisplay" data-testid="TurnDisplay">
    TurnDisplay Component
  </div>
);

export default TurnDisplay;
