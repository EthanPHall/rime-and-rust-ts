import React, { FC } from 'react';
import './ExplorationResourcesEntry.css';
import { IItem, ItemQuantity, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import transferItems from '../../../classes/utility/transferItems';

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

  

  return (
  <div className="exploration-resources-entry" data-testid="exploration-resources-entry">
    <div className='resource-name'>{itemToDisplay.getName()}:</div>
    <div className='amount-and-increments'>
      <div className='resource-amount'>{explorationInventory.find((itemQuantity) => {return itemQuantity.getBaseItem().getKey() == itemToDisplay.getKey()})?.getQuantity()}</div>
      <div className='increment-decrement'>
        <button className='resource-increment' onClick={
          () => {
            transferItems(inventory, explorationInventory, itemToDisplay.getKey(), 1);
            setInventory(inventory.clone());
            setExplorationInventory(explorationInventory.clone());
          }
        }>+</button>
        <button className='resource-decrement' onClick={
          () => {
            transferItems(explorationInventory, inventory, itemToDisplay.getKey(), 1);
            setInventory(inventory.clone());
            setExplorationInventory(explorationInventory.clone());
          }
        }>-</button>
      </div>
      <div className='increment-decrement'>
        <button className='resource-increment-large' onClick={
          () => {
            transferItems(inventory, explorationInventory, itemToDisplay.getKey(), 5);
            setInventory(inventory.clone());
            setExplorationInventory(explorationInventory.clone());
          }
        }>+</button>
        <button className='resource-decrement-large' onClick={
          () => {
            transferItems(explorationInventory, inventory, itemToDisplay.getKey(), 5);
            setInventory(inventory.clone());
            setExplorationInventory(explorationInventory.clone());
          }
        }>-</button>
      </div>
    </div>
  </div>
);}

export default ExplorationResourcesEntry;
