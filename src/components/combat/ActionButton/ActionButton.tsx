import React, { FC } from 'react';
import './ActionButton.css';

interface ActionButtonProps {}

const ActionButton: FC<ActionButtonProps> = () => (
  <div className="action-button" data-testid="action-button">
    <button>Telekinesis</button>
  </div>
);

export default ActionButton;
