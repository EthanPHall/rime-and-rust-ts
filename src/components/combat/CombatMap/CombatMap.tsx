import React, { FC } from 'react';
import './CombatMap.css';

interface CombatMapProps {}

const CombatMap: FC<CombatMapProps> = () => (
  <div className="combat-map" data-testid="combat-map">
    CombatMap Component
  </div>
);

export default CombatMap;
