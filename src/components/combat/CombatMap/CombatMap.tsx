import React, { FC } from 'react';
import './CombatMap.css';

interface CombatMapProps {}

const CombatMap: FC<CombatMapProps> = () => (
  <div className="CombatMap" data-testid="CombatMap">
    CombatMap Component
  </div>
);

export default CombatMap;
