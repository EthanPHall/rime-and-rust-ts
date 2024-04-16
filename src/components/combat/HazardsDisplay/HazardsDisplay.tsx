import React, { FC } from 'react';
import './HazardsDisplay.css';

interface HazardsDisplayProps {}

const HazardsDisplay: FC<HazardsDisplayProps> = () => (
  <div className="hazards-display" data-testid="hazards-display">
    <div className='hazard-entry'>
      <div className='hazard-symbol'>
        +:
      </div>
      <div className='hazard-name'>
        Volatile Tank
      </div> 
    </div>
  </div>
);

export default HazardsDisplay;
