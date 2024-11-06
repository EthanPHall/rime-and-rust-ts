import React, { FC, useContext, useEffect, useState } from 'react';
import './CombatPrepWindow.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import PrepWindowActionEntry from '../PrepWindowActionEntry/PrepWindowActionEntry';
import { Equipment, EquipmentQuantity, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import { CombatActionSeed } from '../../../classes/combat/CombatAction';
import { Message, MessageContext } from '../../../classes/caravan/Message';
import { MessageHandlingContext } from '../../../App';
import EquipmentActionsManager from '../../../classes/caravan/EquipmentActionsManager';
import PlayerCombatStats from '../../../classes/combat/PlayerCombatStats';

interface CombatPrepWindowProps {
  explorationInventory:UniqueItemQuantitiesList
  combatActionList:CombatActionSeed[],
  setCombatActionList:React.Dispatch<React.SetStateAction<CombatActionSeed[]>>,
  defaultActions:CombatActionSeed[],
  alwaysPreparedActions:CombatActionSeed[],
  equipmentActionsManager:EquipmentActionsManager,
  setEquipmentActionsManager:React.Dispatch<React.SetStateAction<EquipmentActionsManager>>,
  playerCombatStats:PlayerCombatStats
}

const CombatPrepWindow: FC<CombatPrepWindowProps> = (
  {
    explorationInventory,
    combatActionList,
    setCombatActionList,
    defaultActions,
    alwaysPreparedActions,
    equipmentActionsManager,
    setEquipmentActionsManager,
    playerCombatStats
  }
) => {

  const messageContext = useContext(MessageHandlingContext);

  const [equipmentItems, setEquipmentItems] = useState<EquipmentQuantity[]>(
    Equipment.pickOutEquipmentQuantities(explorationInventory)
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
    //Get the item quanitites for the equipment.
    const newEquipmentItems:EquipmentQuantity[] = Equipment.pickOutEquipmentQuantities(explorationInventory);

    setEquipmentItems(
      newEquipmentItems
        .filter((itemQuantity) => {
          return itemQuantity.getQuantity() > 0;
        })
      );
  }, [explorationInventory]);

  useEffect(() => {
    
    let newEquipmentActions:CombatActionSeed[] = [];
    let newManager = equipmentActionsManager.clone();

    let toClean:CombatActionSeed[] = [];
    const foundEquipment:string[] = [];
    
    equipmentItems.forEach((equipment) => {
      foundEquipment.push(equipment.getBaseEquipment().getName());
      const [seeds, managerResult] = equipmentActionsManager.requestActions(equipment.getBaseEquipment(), equipment.getQuantity());
      newManager = managerResult;

      //We just go ahead and clean every action that isn't being used, regardless of whether or not we strictly need to. Keep it simple.
      toClean = [...toClean, ...equipmentActionsManager.getLatterActions(equipment.getBaseEquipment(), equipment.getQuantity())];

      newEquipmentActions = [...newEquipmentActions, ...seeds];
    });

    //We also need to clean out any actions for equipment that is no longer being used.
    toClean = [...toClean, ...equipmentActionsManager.getAllActionsExcludingKeys(foundEquipment)];

    setCombatActionList(
      (prev) => {
        return prev.filter((prepared) => {
          return !toClean.some((seedToClean) => {
            return seedToClean.id == prepared.id;
          });
        });
      }
    );
    setEquipmentActionsManager(newManager);
    setEquipmentActions(newEquipmentActions);

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
      messageContext.messageHandling.getManager().addMessage(new Message(`You cannot unprep ${actionSeed.key}.`, []));
    }

    setCombatActionList(newCombatActionList);
  }

  return(
    <div className="combat-prep-window">
      <SectionLabel sectionName='Stats & Actions'></SectionLabel>
      <div className='remaining-action-selections'>{`Selections: ${combatActionList.length}/8`}</div>
      <div className='stats'>
        <div className='hpStat'>Max HP: {`${playerCombatStats.getHealth()}`}</div>
        <div className='speedStat'>Speed: {`${playerCombatStats.getSpeed()}`}</div>
      </div>
      <div className='resources-separator'></div>
      <div className='actions'>
        {[...alwaysPreparedActions, ...defaultActions, ...equipmentActions].map((actionSeed, i) => {
          return <PrepWindowActionEntry 
            key={`actionSeed.name-${i}`} 
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
