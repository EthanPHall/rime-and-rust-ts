import React, { FC } from 'react';
import './CombatParent.css';

interface CombatParentProps {}

const CombatParent: FC<CombatParentProps> = () => (
  <div className="combat-parent" data-testid="combat-parent">
      <div className='combat-parent-grid-parent'>
        <div className='combat-parent-map-actions-composite'>
          <div className='combat-parent-battle-map'>Battle Map</div>
          <div className='combat-parent-actions'>Actions</div>
        </div>
          <div className='combat-parent-loot'>Loot</div>
          <div className='combat-parent-hp'>HP</div>
          <div className='combat-parent-turn'>Turn</div>
          <div className='combat-parent-action-sequence'>Action Sequence</div>
          <div className='combat-parent-swappable-section'>Swappable Section</div>
      </div>
  </div>
);

export default CombatParent;
