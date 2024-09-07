import React, { FC } from 'react';
import './ExplorationResourcesPicker.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import ExplorationResourcesEntry from '../ExplorationResourcesEntry/ExplorationResourcesEntry';
import { ItemQuantity, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import explorationItems from '../../../data/caravan/exploration-items.json';

interface ExplorationResourcesPickerProps {
  inventory:UniqueItemQuantitiesList;
  setInventory:(inventory:UniqueItemQuantitiesList)=>void;
  explorationInventory:UniqueItemQuantitiesList;
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;
}

const ExplorationResourcesPicker: FC<ExplorationResourcesPickerProps> = (
  {inventory, setInventory, explorationInventory, setExplorationInventory}
) =>{

  function getInventoryItemsThatAreExplorationItems():ItemQuantity[] {
    return inventory.filter((itemQuantity) => {
      return explorationItems.includes(itemQuantity.getBaseItem().getKey());
    });
  }

  return (
  <div className="exploration-resources-picker" data-testid="exploration-resources-picker">
    <SectionLabel sectionName='Equipment'></SectionLabel>
    <div className='capacity'>
      {explorationInventory.getMaxCapacity() != Infinity && `Capacity: ${explorationInventory.getCurrentCapacity()}/${explorationInventory.getMaxCapacity()}`}
    </div>
    <div className='exploration-inventory'>
      {getInventoryItemsThatAreExplorationItems().map((itemQuantity) => {
        return <ExplorationResourcesEntry
          key={itemQuantity.getBaseItem().getKey()}
          inventory={inventory}
          setInventory={setInventory}
          explorationInventory={explorationInventory}
          setExplorationInventory={setExplorationInventory}
          itemToDisplay={itemQuantity.getBaseItem()}
        ></ExplorationResourcesEntry>
      })}
    </div>
  </div>
);}

export default ExplorationResourcesPicker;
