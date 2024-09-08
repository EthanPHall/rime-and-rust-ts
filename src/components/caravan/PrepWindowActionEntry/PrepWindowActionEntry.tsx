import React, { FC, useEffect } from 'react';
import './PrepWindowActionEntry.css';
import { CombatActionSeed } from '../../../classes/combat/CombatAction';

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

  return (
    <div className="prep-window-action-entry">
      <div className='action-name'>
        {`${actionSeed.name} x${actionSeed.uses}`}
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
