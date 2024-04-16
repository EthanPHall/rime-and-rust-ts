import React, { FC } from 'react';
import './EnemiesDisplay.css';

interface EnemiesDisplayProps {}

const EnemiesDisplay: FC<EnemiesDisplayProps> = () => (
  <div className="enemies-display" data-testid="enemies-display">
    <div className='enemy-entry'>
      <div className='enemy-symbol'>
        E:
      </div>
      <div className='enemy-hp'>
        5/5 hp
      </div> 
    </div>
  </div>
);

export default EnemiesDisplay;
