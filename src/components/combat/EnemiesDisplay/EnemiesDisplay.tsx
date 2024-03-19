import React, { FC } from 'react';
import './EnemiesDisplay.css';

interface EnemiesDisplayProps {}

const EnemiesDisplay: FC<EnemiesDisplayProps> = () => (
  <div className="EnemiesDisplay" data-testid="EnemiesDisplay">
    EnemiesDisplay Component
  </div>
);

export default EnemiesDisplay;
