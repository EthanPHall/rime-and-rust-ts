import React, { FC, useCallback, useEffect, useState } from 'react';
import './ActionButton.css';
import { EnumType } from 'typescript';
import { Dir } from 'fs';
import { act } from 'react-dom/test-utils';
import { stringify } from 'querystring';
import { send } from 'process';
import CombatAction from '../../../classes/combat/CombatAction';
import Directions from '../../../classes/utility/Directions';
import { CombatActionWithUses } from '../../../classes/combat/CombatAction';

interface ActionButtonProps {
  addToComboList: (newAction: CombatAction) => void;
  action: CombatActionWithUses;
  actionIndex: number;
  reduceActionUses: (index:number) => void;
  buttonsShouldBeDisabled: () => boolean;
}

const ActionButton: FC<ActionButtonProps> = ({addToComboList, action, actionIndex, reduceActionUses, buttonsShouldBeDisabled}: ActionButtonProps) => {
  const [activateControls, setActivateControls] = useState<boolean>(false);
  const [direction, setDirection] = useState<Directions>(Directions.NONE);
 
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
        action.action.direction = Directions.UP;
        break;
      case Directions.DOWN:
        action.action.direction = Directions.DOWN;
        break;
      case Directions.LEFT:
        action.action.direction = Directions.LEFT;
        break;
      case Directions.RIGHT:
        action.action.direction = Directions.RIGHT;
        break;
      }
    
    sendOffAction(action);

    setActivateControls(false);

  }, [direction]);

  function sendOffAction(actionToSendOff:CombatActionWithUses|null) : boolean{
    if (actionToSendOff === null) {
      console.log("No action to send off.");
      return false;
    } else {
      reduceActionUses(actionIndex);
      addToComboList(CombatAction.clone(actionToSendOff.action));

      return true;
    }
  }
  
  function setupForDirectionalInput() : void{
    if(action.uses <= 0){
      return;
    }

    if(!action.action.directional){
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
      <button className="action-button" data-testid="action-button" onClick={setupForDirectionalInput} disabled={buttonsShouldBeDisabled()}>
        {`${action.action.name} x${action.uses}`}
      </button>
    </div>
  );
}

export default ActionButton;
