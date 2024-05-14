import React, { FC } from 'react';
import './HazardsDisplay.css';

interface HazardsDisplayProps {}

class Hazard{
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

const HazardInfoCard: FC<{hazard: Hazard, hideCard: () => void}> = ({hazard, hideCard}) => {
  return (
    <div className="hazard-info" data-testid="hazard-info">
      <h3>{hazard.name}</h3>
      <p>{hazard.description}</p>
      <button onClick={hideCard}>Close</button>
    </div>
  );
}

const HazardEntry: FC<{hazard: Hazard, onClick: () => void}> = ({hazard, onClick}) => {
  return (
    <div className="hazard-entry" data-testid="hazard-entry" onClick={onClick}>
      <span>{`${hazard.symbol}:`}</span>
      <span>{`${hazard.hp}/${hazard.maxHp}`}</span>
    </div>
  );
}

const HazardsDisplay: FC<HazardsDisplayProps> = () => {
  const [hazards, setHazards] = React.useState<Hazard[]>([
    new Hazard(5, 5, '+', 'Volatile Tank', 'A tank that explodes when destroyed'),
    new Hazard(5, 5, '+', 'Volatile Tank', 'A tank that explodes when destroyed'),
    new Hazard(5, 5, '+', 'Volatile Tank', 'A tank that explodes when destroyed'),
  ]);
  const [displayInfoForHazard, setDisplayInfoForHazard] = React.useState<Hazard | null>(null);
  
  return (
    <>
      {displayInfoForHazard && (
        <div className="hazard-info" data-testid="hazard-info">
          <HazardInfoCard hazard={displayInfoForHazard} hideCard={() => setDisplayInfoForHazard(null)} />
        </div>
      )}
      <div className="hazards-display" data-testid="hazards-display">
        {
          hazards.map((hazard, index) => (
            <HazardEntry key={index} hazard={hazard} onClick={() => setDisplayInfoForHazard(hazard)} />
          ))
        }
      </div>
    </>
);}

export default HazardsDisplay;
