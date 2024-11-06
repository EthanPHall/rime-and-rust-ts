import React, { FC, useEffect } from 'react';
import './PrepWindowActionEntry.css';
import { CombatActionSeed } from '../../../classes/combat/CombatAction';
import CombatActionFactory from '../../../classes/combat/CombatActionFactory';
import keysToNames from '../../../data/combat/combat-action-key-to-display-name.json';

interface PrepWindowActionEntryProps {
  actionSeed: CombatActionSeed;
  prepped:boolean;
  alwaysPrepped:boolean;
  tryToPrep:(actionSeed:CombatActionSeed)=>void;
  tryToUnprep:(actionSeed:CombatActionSeed)=>void;
}

const PrepWindowActionEntry: FC<PrepWindowActionEntryProps> = (
  {
    actionSeed,
    prepped,
    alwaysPrepped,
    tryToPrep,
    tryToUnprep
  }
) => {

  useEffect(() => {console.log(prepped)}, []);

  const actionName = keysToNames.find((keyToName) => keyToName.key == actionSeed.key)?.displayName;

  return (
    <div className="prep-window-action-entry">
      <div className='action-name'>
        {`${actionName || actionSeed.key} x${actionSeed.uses}`}
      </div>
      <button className='action-toggle' onClick={
        () => {
          if(prepped){
            tryToUnprep(actionSeed);
          }
          else{
            tryToPrep(actionSeed);
          }
        }
      }>
        [{` ${prepped ? 'x' : ' '} `}]
      </button>
    </div>
  );
}

export default PrepWindowActionEntry;
