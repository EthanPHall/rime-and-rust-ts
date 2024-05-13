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


const ActionButton: FC<ActionButtonProps> = () => {
  const [activateControls, setActivateControls] = useState<boolean>(false);
  const [direction, setDirection] = useState<Directions>(Directions.NONE);
  const [action, setAction] = useState<CombatAction>(new CombatAction("Attack", true));

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

    let actionToSendOff:CombatAction|null = null;
    switch(direction){
      case Directions.UP:
        actionToSendOff = CombatAction.clone(action);
        actionToSendOff.direction = Directions.UP;
        break;
      case Directions.DOWN:
        actionToSendOff = CombatAction.clone(action);
        actionToSendOff.direction = Directions.DOWN;
        break;
      case Directions.LEFT:
        actionToSendOff = CombatAction.clone(action);
        actionToSendOff.direction = Directions.LEFT;
        break;
      case Directions.RIGHT:
        actionToSendOff = CombatAction.clone(action);
        actionToSendOff.direction = Directions.RIGHT;
        break;
      }
    
    sendOffAction(actionToSendOff);

    setActivateControls(false);

  }, [direction]);

  function sendOffAction(actionToSendOff:CombatAction|null) : boolean{
    if (actionToSendOff === null) {
      console.log("No action to send off.");
      return false;
    } else {
      console.log("Sending off action: ", (actionToSendOff as CombatAction).dataToObject());
      return true;
    }
  }
  
  function setupForDirectionalInput() : void{
    if(!action.directional){
      sendOffAction(action);
    }
    else{
      setDirection(Directions.NONE);
      setActivateControls(true);
    }
  }

  return (
    <div>
      <div className={`${activateControls ? "direction-input-cover" : ""}`}>
      </div>
      <button className="action-button" data-testid="action-button" onClick={setupForDirectionalInput}>
        {action.name}
      </button>
    </div>
  );
}

export default ActionButton;
