import React, { FC } from 'react';
import './CombatMapLocation.css';

interface CombatMapLocationProps {
  symbol?: string;
}

const CombatMapLocation: FC<CombatMapLocationProps> = (props: CombatMapLocationProps) => {
  console.log(props as CombatMapLocationProps);

  return (<span className="combat-map-location" data-testid="combat-map-location">
    {props.symbol}
  </span>);
}

CombatMapLocation.defaultProps = {
  symbol: "."
}

export default CombatMapLocation;
