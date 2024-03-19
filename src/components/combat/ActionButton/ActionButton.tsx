import React, { FC } from 'react';
import './ActionButton.css';

interface ActionButtonProps {}

const ActionButton: FC<ActionButtonProps> = () => (
  <div className="ActionButton" data-testid="ActionButton">
    ActionButton Component
  </div>
);

export default ActionButton;
