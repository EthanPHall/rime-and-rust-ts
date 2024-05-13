import React, { FC, useCallback, useEffect, useState } from 'react';
import './ActionButton.css';
import { EnumType } from 'typescript';
import { Dir } from 'fs';
import { act } from 'react-dom/test-utils';
import { stringify } from 'querystring';
import { send } from 'process';

interface ActionButtonProps {}

enum Directions {UP, DOWN, LEFT, RIGHT, NONE};
class CombatAction{
  static incrementor: number = 0;
  
  name: string;
  directional: boolean;
  direction: Directions; 
  constructor(name: string, directional: boolean, direction: Directions = Directions.NONE){    
    this.name = name + " " + CombatAction.incrementor;
    this.directional = directional;
    this.direction = direction;

    CombatAction.incrementor++;
  }

  static clone(action:CombatAction) : CombatAction{
    return new CombatAction(action.name, action.directional, action.direction);
  }

  dataToObject() : Object{
    return {
      name: this.name,
      directional: this.directional,
      direction: Directions[this.direction]
    };
  }
}
class CombatActionWithUses{
  action: CombatAction;
  uses: number;

  constructor(action: CombatAction, uses: number){
    this.action = action;
    this.uses = uses;
  }
}


const ActionButton: FC<ActionButtonProps> = () => {
  const USES = 2;

  const [activateControls, setActivateControls] = useState<boolean>(false);
  const [direction, setDirection] = useState<Directions>(Directions.NONE);
  const [actionWithUses, setActionWithUses] = useState<CombatActionWithUses>(new CombatActionWithUses(new CombatAction("Attack", true), USES));

  const handleDirectionInputs = useCallback((event:any) => {
    if (activateControls && (event.key === "ArrowUp" || event.key === "w")) {
      setDirection(Directions.UP);
    }
    else if (activateControls && (event.key === "ArrowDown" || event.key === "s")) {
      setDirection(Directions.DOWN);
    }
    else if (activateControls && (event.key === "ArrowLeft" || event.key === "a")) {
      setDirection(Directions.LEFT);
    }
    else if (activateControls && (event.key === "ArrowRight" || event.key === "d")) {
      setDirection(Directions.RIGHT);
    }
  }, [activateControls, setDirection]);

  useEffect(() => {
    document.addEventListener("keydown", handleDirectionInputs, false);

    return () => {
      document.removeEventListener("keydown", handleDirectionInputs, false);
    };
  }, [handleDirectionInputs]);

  useEffect(() => {
    if(direction === Directions.NONE){
      return;
    }

    switch(direction){
      case Directions.UP:
        actionWithUses.action.direction = Directions.UP;
        break;
      case Directions.DOWN:
        actionWithUses.action.direction = Directions.DOWN;
        break;
      case Directions.LEFT:
        actionWithUses.action.direction = Directions.LEFT;
        break;
      case Directions.RIGHT:
        actionWithUses.action.direction = Directions.RIGHT;
        break;
      }
    
    sendOffAction(actionWithUses);

    setActivateControls(false);

  }, [direction]);

  function sendOffAction(actionToSendOff:CombatActionWithUses|null) : boolean{
    if (actionToSendOff === null) {
      console.log("No action to send off.");
      return false;
    } else {
      actionToSendOff.uses--;
      setActionWithUses(actionToSendOff);
      console.log("Sending off action: ", CombatAction.clone(actionToSendOff.action).dataToObject());

      return true;
    }
  }
  
  function setupForDirectionalInput() : void{
    if(actionWithUses.uses <= 0){
      return;
    }

    if(!actionWithUses.action.directional){
      sendOffAction(actionWithUses);
    }
    else{
      setDirection(Directions.NONE);
      setActivateControls(true);
    }
  }

  function resetUses() : void{
    setActionWithUses(new CombatActionWithUses(actionWithUses.action, USES));
  }

  return (
    <div>
      <div className={`${activateControls ? "direction-input-cover" : ""}`}>
      </div>
      <button className="reset-button" data-testid="reset-button" onClick={resetUses}>Reset Uses</button>
      <button className="action-button" data-testid="action-button" onClick={setupForDirectionalInput}>
        {`${actionWithUses.action.name} x${actionWithUses.uses}`}
      </button>
    </div>
  );
}

export default ActionButton;
