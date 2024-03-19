import React, { FC } from 'react';
import './HazardsDisplay.css';

interface HazardsDisplayProps {}

const HazardsDisplay: FC<HazardsDisplayProps> = () => (
  <div className="HazardsDisplay" data-testid="HazardsDisplay">
    HazardsDisplay Component
  </div>
);

export default HazardsDisplay;
