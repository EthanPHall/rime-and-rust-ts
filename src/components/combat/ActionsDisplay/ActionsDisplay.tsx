import React, { FC } from 'react';
import './ActionsDisplay.css';

interface ActionsDisplayProps {}

const ActionsDisplay: FC<ActionsDisplayProps> = () => (
  <div className="actions-display" data-testid="actions-display">
    ActionsDisplay Component
  </div>
);

export default ActionsDisplay;
