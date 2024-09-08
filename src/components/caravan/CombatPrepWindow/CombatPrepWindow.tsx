import React, { FC, useContext, useEffect, useState } from 'react';
import './CombatPrepWindow.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import PrepWindowActionEntry from '../PrepWindowActionEntry/PrepWindowActionEntry';
import { Equipment, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import { CombatActionSeed } from '../../../classes/combat/CombatAction';
import { Message, MessageContext } from '../../../classes/caravan/Message';
import { MessageHandlingContext } from '../../../App';

interface CombatPrepWindowProps {
  explorationInventory:UniqueItemQuantitiesList
  combatActionList:CombatActionSeed[],
  setCombatActionList:React.Dispatch<React.SetStateAction<CombatActionSeed[]>>,
  defaultActions:CombatActionSeed[],
  alwaysPreparedActions:CombatActionSeed[]
}

const CombatPrepWindow: FC<CombatPrepWindowProps> = (
  {
    explorationInventory,
    combatActionList,
    setCombatActionList,
    defaultActions,
    alwaysPreparedActions
  }
) => {

  const messageContext = useContext(MessageHandlingContext);

  const [equipmentItems, setEquipmentItems] = useState<Equipment[]>(
    Equipment.pickOutEquipmentQuantities(explorationInventory).map(
      (itemQuantity) => {
        return itemQuantity.getBaseEquipment();
      }
    )
  );

  const [equipmentActions, setEquipmentActions] = useState<CombatActionSeed[]>([]);

  useEffect(() => {
    console.log(
      combatActionList,
      defaultActions,
      alwaysPreparedActions,
      equipmentActions
    );
  }, []);

  useEffect(() => {
    setEquipmentItems(Equipment.pickOutEquipmentQuantities(explorationInventory)
      .filter((itemQuantity) => {
        return itemQuantity.getQuantity() > 0;
      })
      .map((itemQuantity) => {
        return itemQuantity.getBaseEquipment();
      }
    ));
  }, [explorationInventory]);

  useEffect(() => {
    setEquipmentActions(
      equipmentItems.reduce((acc:CombatActionSeed[], equipment) => {
        return acc.concat(equipment.getActionSeed());
      }, [])
    );

  }, [equipmentItems]);

  function tryToPrepAction(actionSeed:CombatActionSeed) {
    if (combatActionList.length < 8) {
      setCombatActionList([...combatActionList, actionSeed]);
    }
    else{
      messageContext.messageHandling.getManager().addMessage(new Message('You can only have 8 actions prepped at a time.', []));
    }
  }

  function tryToUnprepAction(actionSeed:CombatActionSeed) {
    const newCombatActionList = combatActionList.filter((prepared) => {
      if(alwaysPreparedActions.some((prepared) => {
        return prepared.id == actionSeed.id;
      })){
        return true;
      }
      
      return prepared.id != actionSeed.id;
    });

    if(newCombatActionList.length == combatActionList.length){
      messageContext.messageHandling.getManager().addMessage(new Message(`You cannot unprep ${actionSeed.name}.`, []));
    }

    setCombatActionList(newCombatActionList);
  }

  return(
    <div className="combat-prep-window">
      <SectionLabel sectionName='Stats & Actions'></SectionLabel>
      <div className='remaining-action-selections'>{`Selections: ${combatActionList.length}/8`}</div>
      <div className='stats'>
        <div className='hpStat'>Max HP: 10</div>
        <div className='speedStat'>Speed: 5</div>
      </div>
      <div className='resources-separator'></div>
      <div className='actions'>
        {[...alwaysPreparedActions, ...defaultActions, ...equipmentActions].map((actionSeed) => {
          return <PrepWindowActionEntry 
            key={actionSeed.name} 
            actionSeed={actionSeed}
            prepped={combatActionList.some((prepared) => {
              // console.log(prepared, actionSeed);
              return prepared.id == actionSeed.id;
            })}
            alwaysPrepped={alwaysPreparedActions.some((prepared) => {
              return prepared.id == actionSeed.id;
            })}
            tryToPrep={tryToPrepAction}
            tryToUnprep={tryToUnprepAction}
          ></PrepWindowActionEntry>
        })}
      </div>
    </div>
  );
}

export default CombatPrepWindow;
