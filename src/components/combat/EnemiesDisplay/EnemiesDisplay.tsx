import React, { FC } from 'react';
import './EnemiesDisplay.css';
import CombatEnemy from '../../../classes/combat/CombatEnemy';

interface EnemiesDisplayProps {
  enemies: CombatEnemy[];
  showCard: (title: string, description: string) => void;
}

const EnemyEntry: FC<{enemy: CombatEnemy, onClick: () => void}> = ({enemy, onClick}) => {
  return (
    <div className="enemy-entry" data-testid="enemy-entry" onClick={onClick}>
      <span>{`${enemy.symbol}: `}</span>
      <span>{enemy.hp}/{enemy.maxHp}</span>
    </div>
  );
}

const EnemiesDisplay: FC<EnemiesDisplayProps> = ({enemies, showCard}: EnemiesDisplayProps) => {
  return (
    <>
      <div className="enemies-display" data-testid="enemies-display">
        {
          enemies.map((enemy, index) => (
            <EnemyEntry key={index} enemy={enemy} onClick={() => showCard(enemy.name, enemy.description)} />
          ))
        }
      </div>
    </>
  );
}

export default EnemiesDisplay;
