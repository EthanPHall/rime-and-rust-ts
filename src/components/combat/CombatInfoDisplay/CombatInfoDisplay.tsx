import React, { FC } from 'react';
import './CombatInfoDisplay.css';

interface CombatInfoDisplayProps {
  title: string;
  description: string;
  hideCard: () => void;
}

const CombatInfoDisplay: FC<CombatInfoDisplayProps> = ({title, description, hideCard}: CombatInfoDisplayProps) => {
  return (
    <div className="combat-info" data-testid="combat-info">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={hideCard}>Close</button>
    </div>
  );
}


export default CombatInfoDisplay;
export type { CombatInfoDisplayProps };