import React, { FC } from 'react';
import './TurnDisplay.css';

interface TurnDisplayProps {}

class TurnTaker{
  name: string;
  symbol: string;
  constructor(name: string, symbol: string){
    this.name = name;
    this.symbol = symbol;
  }
}

const TurnDisplay: FC<TurnDisplayProps> = () => {
  const [turnTaker, setTurnTaker] = React.useState<TurnTaker>(new TurnTaker('Big Goblin', 'G'));
  
  return (
    <div className="turn-display" data-testid="turn-display">
      Turn:
      <div className="turn-taker" data-testid="turn-taker">
        {turnTaker.symbol}
      </div>
    </div>
  );
}

export default TurnDisplay;
