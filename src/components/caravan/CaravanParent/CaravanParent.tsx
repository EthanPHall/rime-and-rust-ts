import React, { FC, useContext, useEffect, useState } from 'react';
import './CaravanParent.css';
import CaravanSectionCrafting from '../CaravanSectionCrafting/CaravanSectionCrafting';
import CaravanSectionNavBar from '../CaravanSectionNavBar/CaravanSectionNavBar';
import CaravanSectionOptions from '../CaravanSectionOptions/CaravanSectionOptions';
import CaravanSectionSleds from '../CaravanSectionSleds/CaravanSectionSleds';
import CaravanSectionExploration from '../CaravanSectionExploration/CaravanSectionExploration';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import useRefState from '../../../hooks/combat/useRefState';
import { ItemFactoryContext, MainGameScreens, MessageHandlingContext, ProgressionContext, ProgressionContextType, ProgressionFlags } from '../../../App';
import resourceData from '../../../data/caravan/resources.json';
import { IItem, IItemFactory, ItemFactoryJSON, ItemQuantity, Recipe, Resource, UniqueItemQuantitiesList,Sled, IRecipeFail, RecipeFail, SledDog, SledQuantity } from '../../../classes/caravan/Item';
import CaravanSectionValuables from '../CaravanSectionValuables/CaravanSectionValuables';
import tradableItems from '../../../data/caravan/tradable-items.json';
import SledDogComponent from '../SledDog/SledDog';
import { SaveObject } from '../../../context/misc/SettingsContext';

enum CaravanSectionNames{
  CRAFTING="CRAFTING",
  SLEDS="SLEDS",
  EXPLORATION="EXPLORATION"
}

interface CaravanParentProps {
  sleds:Sled[];
  setSleds:React.Dispatch<React.SetStateAction<Sled[]>>;
  getInventory:()=>UniqueItemQuantitiesList;
  executeRecipe:(recipe:Recipe)=>void;
  workers:number;
  setWorkers:React.Dispatch<React.SetStateAction<number>>;
  sellSled:(sled:Sled)=>void;

  inventory:UniqueItemQuantitiesList;
  setInventory:(inventory:UniqueItemQuantitiesList)=>void;
  explorationInventory:UniqueItemQuantitiesList;
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>;

  setMainGameScreen:React.Dispatch<React.SetStateAction<MainGameScreens>>;
  getSaveObject():SaveObject;
  setLoadObject:React.Dispatch<React.SetStateAction<SaveObject | null>>;
  autoSaveInterval:NodeJS.Timer;
}

const CaravanParent: FC<CaravanParentProps> = (
  {autoSaveInterval, setLoadObject, getSaveObject, sleds, setSleds, getInventory, executeRecipe, workers, setWorkers, sellSled, inventory, setInventory, explorationInventory, setExplorationInventory, setMainGameScreen}
) => {
  const messageHandlingContext = useContext(MessageHandlingContext);

  const progressionContext:ProgressionContextType = useContext(ProgressionContext);

  const itemFactoryContext = useContext(ItemFactoryContext);
  
  const [sectionToDisplay, getSectionToDisplay, setSectionToDisplay] = useRefState<CaravanSectionNames>(CaravanSectionNames.CRAFTING);

  useEffect(() => {
    const newFlags:ProgressionFlags = progressionContext.flags.clone();

    inventory.forEach((itemQuantity) => {
      newFlags.setFlag("Obtained " + itemQuantity.getBaseItem().getKey());
    });

    // console.log(progressionContext);
    progressionContext.setFlags(newFlags);
  }, [inventory]);

  //Load the tradable list with all resources that are tradeable
  const [tradableList] = useState<IItem[]>(
    itemFactoryContext.getAllItems().filter((item) => {
      if(item.getKey() == 'Forge Sled Cheap') console.log("Forge Sled Cheap");
      return tradableItems.includes(item.getKey());
    })
  );

  //
  function updateSledWorkers(sledsToUpdate:Sled[]){
    //Get a clone of the current inventory
    const newInventory:UniqueItemQuantitiesList = getInventory().clone();

    //Get all of the sleds in the inventory
    const inventorySleds:Sled[] = Sled.pickOutSledQuantities(newInventory).map((currentSledQuantity) => {
        return currentSledQuantity.getBaseSled();
      });

      sledsToUpdate.forEach((currentSledToUpdate) => {
      //For each newSledQuantity, find the corresponding sled in the inventory
      const toUpdate = inventorySleds.find((currentSledQuantity) => {
        return currentSledQuantity.getId() == currentSledToUpdate.getId();
      });

      //If the sled is found, update the sled workers
      if(toUpdate){
        toUpdate.setWorkers(currentSledToUpdate.getWorkers());
      }
    });

    //Set the new inventory
    setInventory(newInventory);
  }
  
  return (
    <div className='caravan-parent'>
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <div className='nav-rendered-composite'>
          <CaravanSectionNavBar getSectionBeingDisplayed={getSectionToDisplay} setSectionToDisplay={setSectionToDisplay}></CaravanSectionNavBar>
          
          {sectionToDisplay==CaravanSectionNames.CRAFTING && <CaravanSectionCrafting sleds={Sled.pickOutSleds(inventory, true)} tradeResources={tradableList} executeRecipe={executeRecipe}></CaravanSectionCrafting>}
          {sectionToDisplay==CaravanSectionNames.SLEDS && <CaravanSectionSleds sleds={sleds} setSleds={setSleds} dogs={SledDog.pickOutSledDogQuantities(inventory)} workers={workers} setWorkers={setWorkers} executeRecipe={executeRecipe} sellSled={sellSled}></CaravanSectionSleds>}
          {sectionToDisplay==CaravanSectionNames.EXPLORATION && <CaravanSectionExploration
            inventory={inventory}
            setInventory={setInventory}
            explorationInventory={explorationInventory}
            setExplorationInventory={setExplorationInventory}
            setMainGameScreen={setMainGameScreen}
          ></CaravanSectionExploration>}
        </div>
        <CaravanSectionValuables resources={Resource.pickOutResourceQuantities(inventory)} dogs={SledDog.pickOutSledDogQuantities(inventory)}></CaravanSectionValuables>
        <CaravanSectionOptions autoSaveInterval={autoSaveInterval} setLoadObject={setLoadObject} getSaveObject={getSaveObject}></CaravanSectionOptions>
      </div>
    </div>
  );
}

export default CaravanParent;
export {CaravanSectionNames}
