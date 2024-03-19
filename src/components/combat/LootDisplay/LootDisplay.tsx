import React, { FC } from 'react';
import './LootDisplay.css';

interface LootDisplayProps {}

const LootDisplay: FC<LootDisplayProps> = () => (
  <div className="LootDisplay" data-testid="LootDisplay">
    LootDisplay Component
  </div>
);

export default LootDisplay;
