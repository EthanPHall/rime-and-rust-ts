import React, { FC } from 'react';
import './CombatParent.css';

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => (
  <div className="CombatParent" data-testid="CombatParent">
    CombatParent Component
  </div>
);

export default CombatParent;
