import React, { FC } from 'react';
import './CombatMapRow.css';

interface CombatMapRowProps {}

const CombatMapRow: FC<CombatMapRowProps> = () => (
  <div className="CombatMapRow" data-testid="CombatMapRow">
    CombatMapRow Component
  </div>
);

export default CombatMapRow;
