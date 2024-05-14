import React, { FC } from 'react';
import './EnemiesDisplay.css';

interface EnemiesDisplayProps {}

class Enemy{
  hp: number;
  maxHp: number;
  symbol: string;
  name: string;
  description: string;
  constructor(hp: number, maxHp: number, symbol: string, name: string, description: string){
    this.hp = hp;
    this.maxHp = maxHp;
    this.symbol = symbol;
    this.name = name;
    this.description = description;
  }
}

const EnemyInfoCard: FC<{enemy: Enemy, hideCard: () => void}> = ({enemy, hideCard}) => {
  return (
    <div className="enemy-info" data-testid="enemy-info">
      <h3>{enemy.name}</h3>
      <p>{enemy.description}</p>
      <button onClick={hideCard}>Close</button>
    </div>
  );
}

const EnemyEntry: FC<{enemy: Enemy, onClick: () => void}> = ({enemy, onClick}) => {
  return (
    <div className="enemy-entry" data-testid="enemy-entry" onClick={onClick}>
      <span>{`${enemy.symbol}: `}</span>
      <span>{enemy.hp}/{enemy.maxHp}</span>
    </div>
  );
}

const EnemiesDisplay: FC<EnemiesDisplayProps> = () => {
  const [enemies, setEnemies] = React.useState<Enemy[]>([
    new Enemy(5, 5, 'g', 'Goblin', 'A small goblin'),
    new Enemy(5, 5, 'g', 'Goblin', 'A small goblin'),
    new Enemy(5, 5, 'g', 'Goblin', 'A small goblin'),
    new Enemy(5, 5, 'g', 'Goblin', 'A small goblin'),
    new Enemy(10, 10, 'G', 'Goblin Boss', 'A big goblin'),
  ]);
  const [displayInfoForEnemy, setDisplayInfoForEnemy] = React.useState<Enemy | null>(null);

  return (
    <>
      {displayInfoForEnemy && (
        <div className="enemy-info" data-testid="enemy-info">
          <EnemyInfoCard enemy={displayInfoForEnemy} hideCard={() => setDisplayInfoForEnemy(null)} />
        </div>
      )}
      <div className="enemies-display" data-testid="enemies-display">
        {
          enemies.map((enemy, index) => (
            <EnemyEntry key={index} enemy={enemy} onClick={() => setDisplayInfoForEnemy(enemy)} />
          ))
        }
      </div>
    </>
  );
}

export default EnemiesDisplay;
