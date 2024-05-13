import React, { FC } from 'react';
import './ActionsDisplay.css';
import ActionButton from '../ActionButton/ActionButton';

interface ActionsDisplayProps {}

const MAX_ACTIONS = 8;

class CombatAction{
  name: string;
  constructor(name: string){
    this.name = name;
  }
}

const actions:CombatAction[] = [];
actions.push(new CombatAction("Attack"));
actions.push(new CombatAction("Defend"));
actions.push(new CombatAction("Magic"));
actions.push(new CombatAction("Item"));
actions.push(new CombatAction("Flee"));
actions.push(new CombatAction("Skill"));
actions.push(new CombatAction("Special"));
actions.push(new CombatAction("Guard"));
actions.push(new CombatAction("Cry"));
actions.push(new CombatAction("Run Away"));
actions.push(new CombatAction("Dear God!"));


const ActionsDisplay: FC<ActionsDisplayProps> = () => (
  <div className="actions-display" data-testid="actions-display">
    {/* {actions.map((action, index) => {
      if(index >= MAX_ACTIONS){
        return;
      }

      return <button>{action.name}</button>
    })} */}
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
