import React, { FC } from 'react';
import './LootDisplay.css';

interface LootDisplayProps {}

const LootDisplay: FC<LootDisplayProps> = () => (
  <div className="loot-display" data-testid="loot-display">
    LootDisplay Component
  </div>
);

export default LootDisplay;
