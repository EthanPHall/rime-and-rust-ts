import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import useRefState from '../../../hooks/combat/useRefState';
import { ItemFactoryContext, MessageHandlingContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from '../../../App';
import resourceData from '../../../data/caravan/resources.json';
import { IItem, IItemFactory, ItemFactoryJSON, ItemQuantity, Recipe, Resource, UniqueItemQuantitiesList,Sled, IRecipeFail, RecipeFail, SledDog } from '../../../classes/caravan/Item';
import CaravanSectionValuables from '../CaravanSectionValuables/CaravanSectionValuables';
import tradableItems from '../../../data/caravan/tradable-items.json';
import SledDogComponent from '../SledDog/SledDog';

enum CaravanSectionNames{
  CRAFTING="CRAFTING",
  SLEDS="SLEDS",
  EXPLORATION="EXPLORATION"
}

interface CaravanParentProps {
  inventory:UniqueItemQuantitiesList;
  getInventory:()=>UniqueItemQuantitiesList;
  setInventory:(newInventory:UniqueItemQuantitiesList)=>void;
  executeRecipe:(recipe:Recipe)=>void;

}

const CaravanParent: FC<CaravanParentProps> = (
  {inventory, getInventory, setInventory, executeRecipe}
) => {
  const messageHandlingContext = useContext(MessageHandlingContext);

  const progressionContext:ProgressionContextType = useContext(ProgressionContext);

  const itemFactoryContext = useContext(ItemFactoryContext);
  
  const [sectionToDisplay, getSectionToDisplay, setSectionToDisplay] = useRefState<CaravanSectionNames>(CaravanSectionNames.CRAFTING);

  const [workers, setWorkers] = useState<number>(10);

  useEffect(() => {
    const newFlags:ProgressionFlags = progressionContext.flags.clone();

    inventory.forEach((itemQuantity) => {
      newFlags.setFlag("Obtained " + itemQuantity.getItem().getKey());
    });

    // console.log(progressionContext);
    progressionContext.setFlags(newFlags);
  }, [inventory]);

  //Load the tradable list with all resources that are tradeable
  const [tradableList] = useState<IItem[]>(
    itemFactoryContext.getAllItems().filter((item) => {
      if(item.getKey() == 'Basic Dog') console.log("Basic Dog");
      return tradableItems.includes(item.getKey());
    })
  );

  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar getSectionBeingDisplayed={getSectionToDisplay} setSectionToDisplay={setSectionToDisplay}></CaravanSectionNavBar>
          
          {sectionToDisplay==CaravanSectionNames.CRAFTING && <CaravanSectionCrafting sleds={Sled.pickOutSleds(inventory)} tradeResources={tradableList} executeRecipe={executeRecipe}></CaravanSectionCrafting>}
          {sectionToDisplay==CaravanSectionNames.SLEDS && <CaravanSectionSleds sledQuantities={Sled.pickOutSledQuantities(inventory)} dogs={SledDog.pickOutSledDogQuantities(inventory)} workers={workers} setWorkers={setWorkers} executeRecipe={executeRecipe}></CaravanSectionSleds>}
          {sectionToDisplay==CaravanSectionNames.EXPLORATION && <CaravanSectionExploration></CaravanSectionExploration>}
        </div>
        <CaravanSectionValuables resources={Resource.pickOutResourceQuantities(inventory)} dogs={SledDog.pickOutSledDogQuantities(inventory)}></CaravanSectionValuables>
        <CaravanSectionOptions></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
export {CaravanSectionNames}
