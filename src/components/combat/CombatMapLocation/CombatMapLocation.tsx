import React, { FC } from 'react';
import './CombatMapLocation.css';

interface CombatMapLocationProps {}

const CombatMapLocation: FC<CombatMapLocationProps> = () => (
  <div className="CombatMapLocation" data-testid="CombatMapLocation">
    CombatMapLocation Component
  </div>
);

export default CombatMapLocation;
