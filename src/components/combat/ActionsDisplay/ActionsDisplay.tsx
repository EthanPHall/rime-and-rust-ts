import React, { FC } from 'react';
import './ActionsDisplay.css';
import ActionButton from '../ActionButton/ActionButton';

interface ActionsDisplayProps {}

const ActionsDisplay: FC<ActionsDisplayProps> = () => (
  <div className="actions-display" data-testid="actions-display">
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
    <ActionButton></ActionButton>
  </div>
);

export default ActionsDisplay;
