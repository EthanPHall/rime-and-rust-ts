import React, { FC, useContext, useEffect, useRef } from 'react';
import './ExplorationResourcesEntry.css';
import { Equipment, IItem, ItemQuantity, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import transferItems from '../../../classes/utility/transferItems';
import weaponLimit from '../../../data/combat/weapon-limit.json';
import { MessageHandlingContext } from '../../../App';
import { Message } from '../../../classes/caravan/Message';

interface ExplorationResourcesEntryProps {
  inventory:UniqueItemQuantitiesList;
  setInventory:(inventory:UniqueItemQuantitiesList)=>void;
  explorationInventory:UniqueItemQuantitiesList;
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
  itemToDisplay:IItem;
}

const ExplorationResourcesEntry: FC<ExplorationResourcesEntryProps> = (
  {inventory, setInventory, explorationInventory, setExplorationInventory, itemToDisplay}
) => {

  function regularInventoryToExplorationInventory(itemKey:string, quantity:number){
    transferItems(inventory, explorationInventory, itemKey, quantity);
    setInventory(inventory.clone());
    setExplorationInventory(explorationInventory.clone());
  }

  function explorationInventoryToRegularInventory(itemKey:string, quantity:number){
    transferItems(explorationInventory, inventory, itemKey, quantity);
    setInventory(inventory.clone());
    setExplorationInventory(explorationInventory.clone());
  }

  const messageManager = useContext(MessageHandlingContext);

  function getCurrentWeaponLimit(givenExplorationInventory?:UniqueItemQuantitiesList):number{
    let modifiers:number = 0;

    const explorationInventoryToUse = givenExplorationInventory ? givenExplorationInventory : explorationInventory;

    explorationInventoryToUse.find((itemQuantity) => {
        if(itemQuantity.getBaseItem().getKey() == weaponLimit.modifier1 && itemQuantity.getQuantity() > 0){
          modifiers++;
        }
      }
    );

    switch(modifiers){
      case 1:
        return weaponLimit.enhancedWeaponLimit1;
      default:
        return weaponLimit.normalWeaponLimit;
    }
  }

  function getCurrentWeaponLimitMessage(givenExplorationInventory?:UniqueItemQuantitiesList):string{
    let modifiers:number = 0;

    const explorationInventoryToUse = givenExplorationInventory ? givenExplorationInventory : explorationInventory;

    explorationInventoryToUse.find((itemQuantity) => {
        if(itemQuantity.getBaseItem().getKey() == weaponLimit.modifier1 && itemQuantity.getQuantity() > 0){
          modifiers++;
        }
      }
    );

    switch(modifiers){
      case 1:
        return weaponLimit.enhancedLimit1ExceedMessage;
      default:
        return weaponLimit.normalLimitExceedMessage;
    }
  }

  const ignoreNextExplorationInventoryChange = useRef(false);
  useEffect(() => {
    if(ignoreNextExplorationInventoryChange.current){
      ignoreNextExplorationInventoryChange.current = false;
      return;
    }

    explorationInventory.find((itemQuantity) => {
      if(itemQuantity.getBaseItem().getKey() == weaponLimit.modifier1 && itemQuantity.getQuantity() <= 0){
        while(explorationInventory.getHowManyWeapons() > getCurrentWeaponLimit()){
          const weapons = explorationInventory
          .filter((itemQuantity) => {
            return itemQuantity.getBaseItem() instanceof Equipment && (itemQuantity.getBaseItem() as Equipment).getIsWeapon();
          })
          .filter((itemQuantity) => { return itemQuantity.getQuantity() > 0; });
  
          transferItems(explorationInventory, inventory, weapons[0].getBaseItem().getKey(), 1);
        }

        setExplorationInventory(explorationInventory.clone());
        ignoreNextExplorationInventoryChange.current = true;
      }
    }
  );
}, [explorationInventory]);

  return (
  <div className="exploration-resources-entry" data-testid="exploration-resources-entry">
    <div className='resource-name'>{itemToDisplay.getName()}:</div>
    <div className='amount-and-increments'>
      <div className='resource-amount'>{explorationInventory.find((itemQuantity) => {return itemQuantity.getBaseItem().getKey() == itemToDisplay.getKey()})?.getQuantity()}</div>
      <div className='increment-decrement'>
        <button className='resource-increment' onClick={
          () => {
            if(itemToDisplay instanceof Equipment && (itemToDisplay as Equipment).getIsWeapon()){
              if(explorationInventory.getHowManyWeapons() >= getCurrentWeaponLimit()){
                messageManager.messageHandling.getManager().addMessage(new Message(getCurrentWeaponLimitMessage(), []));
                messageManager.setMessageHandling(messageManager.messageHandling.clone());
              }
              else{
                regularInventoryToExplorationInventory(itemToDisplay.getKey(), 1);
              }
            }
            else{
              regularInventoryToExplorationInventory(itemToDisplay.getKey(), 1);
            }
          }
        }>+</button>
        <button className='resource-decrement' onClick={
          () => {
            explorationInventoryToRegularInventory(itemToDisplay.getKey(), 1);
          }
        }>-</button>
      </div>
      <div className='increment-decrement'>
        <button className='resource-increment-large' onClick={
          () => {
            if(itemToDisplay instanceof Equipment && (itemToDisplay as Equipment).getIsWeapon()){
              if(explorationInventory.getHowManyWeapons() >= getCurrentWeaponLimit()){
                messageManager.messageHandling.getManager().addMessage(new Message(getCurrentWeaponLimitMessage(), []));
                messageManager.setMessageHandling(messageManager.messageHandling.clone());
              }
              else{
                regularInventoryToExplorationInventory(itemToDisplay.getKey(), 
                  Math.max(Math.min(5, getCurrentWeaponLimit() - explorationInventory.getHowManyWeapons()), 0)
                );
              }
            }
            else{
              regularInventoryToExplorationInventory(itemToDisplay.getKey(), 5);
            }
          }
        }>+</button>
        <button className='resource-decrement-large' onClick={
          () => {
            explorationInventoryToRegularInventory(itemToDisplay.getKey(), 5);
          }
        }>-</button>
      </div>
    </div>
  </div>
);}

export default ExplorationResourcesEntry;
