import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import useRefState from '../../../hooks/combat/useRefState';
import { ItemFactoryContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from '../../../App';
import resourceData from '../../../data/caravan/resources.json';
import { IItem, IItemFactory, ItemFactoryJSON, ItemQuantity, Recipe, Resource, UniqueItemQuantitiesList,Sled } from '../../../classes/caravan/Item';
import CaravanSectionValuables from '../CaravanSectionValuables/CaravanSectionValuables';
import tradableItems from '../../../data/caravan/tradable-items.json';

enum CaravanSectionNames{
  CRAFTING="CRAFTING",
  SLEDS="SLEDS",
  EXPLORATION="EXPLORATION"
}

interface CaravanParentProps {}

const CaravanParent: FC<CaravanParentProps> = () => {
  
  const progressionContext:ProgressionContextType = useContext(ProgressionContext);

  const [sectionToDisplay, getSectionToDisplay, setSectionToDisplay] = useRefState<CaravanSectionNames>(CaravanSectionNames.CRAFTING);
  
  const itemFactoryContext = useContext(ItemFactoryContext);

  const [inventory, getInventory, setInventory] = useRefState<UniqueItemQuantitiesList>(new UniqueItemQuantitiesList([]));

  useEffect(() => {
    const newFlags:ProgressionFlags = progressionContext.flags.clone();

    inventory.forEach((itemQuantity) => {
      newFlags.setFlag("Obtained " + itemQuantity.getItem().getKey());
    });

    console.log(progressionContext);
    progressionContext.setFlags(newFlags);
  }, [inventory]);


  //Load the tradable list with all resources that are tradeable
  const [tradableList] = useState<IItem[]>(
    itemFactoryContext.getAllItems().filter((item) => {
      return tradableItems.includes(item.getKey());
    })
  );

  //this function will be passed as props, so I'm using getInventory() instead of inventory
  function executeRecipe(recipe:Recipe){
    const negativeCosts = getNewQuantitiesThatMatchSign(recipe.getCosts(), -1);
    const newInventory = getInventory().deepClone(itemFactoryContext);
    applyItemChanges(negativeCosts, newInventory);

    if(!newInventory.allQuantitiesArePositive()){
      return;
    }

    applyItemChanges(recipe.getResults(), newInventory);
    setInventory(newInventory);
  }
  function getNewQuantitiesThatMatchSign(itemQuantities:ItemQuantity[], sign:number):ItemQuantity[]{
    return itemQuantities.map((itemQuantity) => {
      const newItemQuantity = itemQuantity.deepClone(itemFactoryContext);

      if(newItemQuantity.getQuantity() * sign < 0){
        newItemQuantity.setQuantity(-newItemQuantity.getQuantity());
      }

      return newItemQuantity;
    });
  }
  function applyItemChanges(itemQuantities:ItemQuantity[], inventory:UniqueItemQuantitiesList){
    itemQuantities.forEach((itemQuantity) => {
      const item = itemQuantity.getItem();
      const existingItemQuantity = inventory.find((existingItemQuantity) => existingItemQuantity.getItem().getKey() == item.getKey());

      if(existingItemQuantity){
        existingItemQuantity.setQuantity(existingItemQuantity.getQuantity() + itemQuantity.getQuantity());
      }else{
        inventory.modify(itemQuantity);
      }
    });
  }

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar getSectionBeingDisplayed={getSectionToDisplay} setSectionToDisplay={setSectionToDisplay}></CaravanSectionNavBar>
          
          {sectionToDisplay==CaravanSectionNames.CRAFTING && <CaravanSectionCrafting sleds={Sled.pickOutSleds(inventory)} tradeResources={tradableList} executeRecipe={executeRecipe}></CaravanSectionCrafting>}
          {sectionToDisplay==CaravanSectionNames.SLEDS && <CaravanSectionSleds></CaravanSectionSleds>}
          {sectionToDisplay==CaravanSectionNames.EXPLORATION && <CaravanSectionExploration></CaravanSectionExploration>}
        </div>
        <CaravanSectionValuables resources={Resource.pickOutResourceQuantities(inventory)}></CaravanSectionValuables>
        <CaravanSectionOptions></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
export {CaravanSectionNames}
