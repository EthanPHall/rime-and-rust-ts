import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './variables.css';
import CaravanParent from './components/caravan/CaravanParent/CaravanParent';
import MapParent from './components/map/MapParent/MapParent';
import CombatParent from './components/combat/CombatParent/CombatParent';
import EventParent from './components/events/EventParent/EventParent';
import progressionFlagsData from './data/global/progression-flags.json';
import { IItem, IItemFactory, ItemFactoryJSON, ItemQuantity, Recipe, RecipeFail, Sled, SledQuantity, UniqueItemQuantitiesList } from './classes/caravan/Item';
import { IMessageFactory, IMessageManager, MessageContext, MessageFactoryJson, MessageManager } from './classes/caravan/Message';
import useRefState from './hooks/combat/useRefState';
import unconsumedCosts from './data/caravan/unconsumed-costs.json';
import { ISettingsManager, SettingsContext, SettingsContextType, SettingsManager } from './context/misc/SettingsContext';
import useExplorationInventory from './hooks/caravan/useExplorationInventory';
import RimeEventJSON from './classes/events/RimeEventJSON';
import IMapLocation from './classes/exploration/IMapLocation';
import ICombatEncounter from './classes/combat/ICombatEncounter';
import explorationItemsToKeepOnDeath from "./data/exploration/exploration-items-to-keep.json";
import explorationItems from "./data/caravan/exploration-items.json";
import transferItems from './classes/utility/transferItems';
import IMap from './classes/exploration/IMap';

type ProgressionFlagsSeed = {
  [key: string]: boolean;
}

class ProgressionFlags{
  private flags:ProgressionFlagsSeed;

  constructor(flags:ProgressionFlagsSeed){
    this.flags = flags;
  }

  clone():ProgressionFlags{
    return new ProgressionFlags({...this.flags});
  }

  setFlag(flagName:string){
    this.flags[flagName] = true;
  }
  unsetFlag(flagName:string){
    this.flags[flagName] = false;
  }

  getFlag(flagName:string):boolean{
    return this.flags[flagName];
  }
}

type ProgressionContextType = {flags: ProgressionFlags, setFlags: (newFlags:ProgressionFlags) => void};
const ProgressionContext = createContext<ProgressionContextType>({flags: new ProgressionFlags(progressionFlagsData), setFlags: () => {}});
const ItemFactoryContext = createContext<IItemFactory>(new ItemFactoryJSON(() => {return 0;}));

const messageFactory:IMessageFactory = new MessageFactoryJson();
const messageManager:IMessageManager = new MessageManager(25);
const MessageHandlingContext = createContext<{messageHandling:MessageContext, setMessageHandling:(newHandling:MessageContext) => void}>({messageHandling: new MessageContext(messageFactory, messageManager), setMessageHandling: () => {}});

enum MainGameScreens{
  CARAVAN="CARAVAN",
  MAP="MAP",
  COMBAT="COMBAT",
}



function App() {
  const [progressionFlags, setProgressionFlags] = React.useState<ProgressionFlags>(new ProgressionFlags(progressionFlagsData));
  const [messageHandlingContext, setMessageHandlingContext] = React.useState<MessageContext>(new MessageContext(messageFactory, messageManager));
  const [settingsManagerContext, setSettingsManagerContext] = React.useState<ISettingsManager>(new SettingsManager());
  const settingsManagerContextRef = useRef<ISettingsManager>(settingsManagerContext);

  const [workers, setWorkers] = useState<number>(20);

  const itemFactoryContext = new ItemFactoryJSON(getExistingSledCount);
  const [inventory, getInventory, setInventory] = useRefState<UniqueItemQuantitiesList>(new UniqueItemQuantitiesList([
    new ItemQuantity(itemFactoryContext.createItem("Scavenger Sled Cheap"), 11),
    new ItemQuantity(itemFactoryContext.createItem("Forge Sled"), 1),
  ]));
  const {explorationInventory, setExplorationInventory} = useExplorationInventory(inventory);

  const [sledsList, setSledsList] = useState<Sled[]>([]);
  const sledsListRef = useRef<Sled[]>(sledsList);

  const sledsListOverrideForInventoryEffect = useRef<Sled[]|null>(null);

  const [currentEvent, setCurrentEvent] = useState<string|null>(null);
  const [currentEventLocation, setCurrentEventLocation] = useState<IMapLocation|null>(null);
  const [mainGameScreen, setMainGameScreen] = useState<MainGameScreens>(MainGameScreens.CARAVAN);
  const [previousGameScreen, setPreviousGameScreen] = useState<MainGameScreens>(mainGameScreen);

  const [combatEncounterKey, setCombatEncounterKey] = useState<string|null>(null);

  const [savedMap,setSavedMap] = useState<IMap|null>(null);
  
  useEffect(() => {
    if(mainGameScreen == MainGameScreens.CARAVAN && previousGameScreen == MainGameScreens.MAP){
      //Transfer regular resources from the explorationInventory to the regular inventory.
      const itemsToTransfer:string[] = explorationInventory.getListCopy().filter((quantity) => {
        return !explorationItems.includes(quantity.getBaseItem().getKey());
      }).map((quantity) => {
        return quantity.getBaseItem().getKey();
      });

      itemsToTransfer.forEach((itemKey) => {
        transferItems(explorationInventory, inventory, itemKey, Infinity)
      });

      //Add an entry to the regular inventory for each exploration item.
      const itemsToMakeSureInventoryHasEntryFor:string[] = explorationInventory.getListCopy().filter((quantity) => {
        return explorationItems.includes(quantity.getBaseItem().getKey());
      }).map((quantity) => {
        return quantity.getBaseItem().getKey();
      });

      itemsToMakeSureInventoryHasEntryFor.forEach((itemKey) => {
        transferItems(explorationInventory, inventory, itemKey, 0)
      });
    }

    setPreviousGameScreen(mainGameScreen);
  }, [mainGameScreen])

  useEffect(() => {
    const inventorySledQuantities:SledQuantity[] = Sled.pickOutSledQuantities(getInventory());
    const sledsGroupedByKey:Sled[][] = groupSledsByKey(sledsList);
    let changed = false;

    inventorySledQuantities.forEach((sledQuantity) => {
      
      const sledKey = sledQuantity.getBaseSled().getKey();
      const sledGroup = sledsGroupedByKey.find((sledGroup) => sledGroup[0]?.getKey() == sledKey);
      
      if(!sledGroup){
        const newSleds:Sled[] = [];
        for(let i = 0; i < sledQuantity.getQuantity(); i++){
          newSleds.push(itemFactoryContext.createItem(sledKey) as Sled);
        }

        sledsGroupedByKey.push(newSleds);

        changed = true;
      }
      else if(sledGroup.length > sledQuantity.getQuantity()){
        if(sledsListOverrideForInventoryEffect.current == null){
          for(let i = 0; i < sledGroup.length - sledQuantity.getQuantity(); i++){
            const sledToRemove = sledGroup.pop();
            refundSledWorkers(sledToRemove as Sled);
          }  
        }
        changed = true;
      }
      else if(sledGroup.length < sledQuantity.getQuantity()){
        for(let i = 0; i < sledQuantity.getQuantity() - sledGroup.length; i++){
          sledGroup.push(itemFactoryContext.createItem(sledKey) as Sled);
        }
        changed = true;
      }
    });

    if(changed){
      if(sledsListOverrideForInventoryEffect.current){
        setSledsList(sledsListOverrideForInventoryEffect.current);
        sledsListOverrideForInventoryEffect.current = null;
      }
      else{
        const newSledsList:Sled[] = sledsGroupedByKey.reduce((previous, current) => {
          return previous.concat(current);
        }, []);
  
        setSledsList(newSledsList);
      }
    }
  }, [inventory]);

  function sellSled(sled:Sled){
    //Get the sled sell recipe
    const sledSellRecipe:Recipe = sled.getSellRecipe(itemFactoryContext);

    //refund the workers
    refundSledWorkers(sled);
    
    //Execute the sell recipe
    executeRecipe(sledSellRecipe);

    //Removing the sled object from the sleds list needs to happen in the inventory effect,
    //so we'll set the new list to use here, and the effect will handle it.
    sledsListOverrideForInventoryEffect.current = sledsList.filter((currentSled) => currentSled.getId() != sled.getId());
  }


  useEffect(() => {
    settingsManagerContextRef.current = settingsManagerContext;
  }, [settingsManagerContext]);

  useEffect(() => {
    const passiveRecipeTimeout = createPassiveRecipeTimeout();

    return () => {
      clearTimeout(passiveRecipeTimeout);
    }
  }, [])

  useEffect(() => {
    console.log(combatEncounterKey);
  }, [combatEncounterKey])

  useEffect(() => {
    sledsListRef.current = sledsList;
  }, [sledsList]);

  function groupSledsByKey(sleds:Sled[]):Sled[][]{
    const sledsByKey = new Map<string, Sled[]>();

    sleds.forEach((sled) => {
      const key = sled.getKey();
      const existingSleds = sledsByKey.get(key);

      if(existingSleds){
        existingSleds.push(sled);
      }else{
        sledsByKey.set(key, [sled]);
      }
    });

    return Array.from(sledsByKey.values());
  }

  function refundSledWorkers(sled:Sled){
    setWorkers((current) => {
      return current + sled.getWorkers();
    });
  }

  function getExistingSledCount():number{
    //Get all of the sleds quantities in inventory
    const sledQuantities = Sled.pickOutSledQuantities(getInventory());

    //Sum up the sleds quantities
    const sledCount = sledQuantities.map((sledQuantity) => {
      return sledQuantity.getQuantity();
    }).reduce((previous, current) => {
      return previous + current;
    }, 0);

    //Return the sum
    return sledCount;
  }

  //This function will be passed as props, so I'm using getInventory() instead of inventory
  function executeRecipe(recipe:Recipe, createFailMessage:boolean = true):boolean{
    const negativeCosts = getNewQuantitiesThatMatchSign(recipe.getCosts(), -1);
    const newInventory = getInventory().deepClone();

    if(!arePrerequisitesMet(recipe, newInventory)){
      return false;
    }

    applyItemChanges(negativeCosts, newInventory);
    
    if(!newInventory.allQuantitiesArePositive()){
      if(createFailMessage){
        const recipeFail:RecipeFail = new RecipeFail(
          recipe,
          newInventory.getNegativeQuantities().map((quantity) => {
            return quantity.getBaseItem().getName()
          })
        );
        
        messageHandlingContext.getManager().addMessage(messageHandlingContext.getFactory().createFailedRecipeMessage(recipeFail));
        setMessageHandlingContext(messageHandlingContext.clone());  
      }
      
      return false;
    }
    
    applyItemChanges(recipe.getResults(), newInventory);
    setInventory(newInventory);

    return true;
  }



  function arePrerequisitesMet(recipe:Recipe, inventory:UniqueItemQuantitiesList):boolean{
    //Define a new type that stores an ItemQuantity and a boolean
    type ItemQuantityBool = {itemQuantity:ItemQuantity, bool:boolean};

    //Get a list of item quantities from the recipe arg where the items are in the unconsumedCosts list, 
    //and map that list to a new list of ItemQuantityBooleans
    const itemQuantityBooleans:ItemQuantityBool[] = recipe.getCosts().filter((cost) => {
      return unconsumedCosts.includes(cost.getBaseItem().getKey());
    }).map((cost) => {
      return {itemQuantity:cost, bool:false};
    });

    //Check the inventory for each item in that list and see if there are enough of the prerequisite items in inventory. 
    //If so, set the boolean to true. If not, set the boolean to false.
    itemQuantityBooleans.forEach((itemQuantityBool) => {
      const iqbItem:IItem = itemQuantityBool.itemQuantity.getBaseItem();
      const iqbQuantity:number = itemQuantityBool.itemQuantity.getQuantity();

      if(inventory.find((itemQuantity) => itemQuantity.getBaseItem().getKey() == iqbItem.getKey() && itemQuantity.getQuantity() >= iqbQuantity) != undefined){
        itemQuantityBool.bool = true;
      }
    });

    //If there are any booleans that are false, return early. Construct a failed recipe that includes only the prerequisites that wrren't met.
    if(itemQuantityBooleans.find((itemQuantityBool) => itemQuantityBool.bool == false)){
      const recipeFail:RecipeFail = new RecipeFail(
        recipe,
        itemQuantityBooleans.filter((itemQuantityBool) => itemQuantityBool.bool == false).map((itemQuantityBool) => {
          return itemQuantityBool.itemQuantity.getBaseItem().getName();
        })
      );

      messageHandlingContext.getManager().addMessage(messageHandlingContext.getFactory().createFailedRecipeMessage(recipeFail));
      setMessageHandlingContext(messageHandlingContext.clone());

      return false;
    }  

    return true;
  }



  function getNewQuantitiesThatMatchSign(itemQuantities:ItemQuantity[], sign:number):ItemQuantity[]{
    return itemQuantities.map((itemQuantity) => {
      const newItemQuantity = itemQuantity.clone();

      if(newItemQuantity.getQuantity() * sign < 0){
        //modifyQuantity() used to set the quantity directly, but now it's used to add or subtract from the quantity.
        //So, if we want the resulting quantity to be existing quantity but negative, then we need to remove twice the existing quantity. 
        newItemQuantity.modifyQuantity(-newItemQuantity.getQuantity() * 2);
      }

      return newItemQuantity;
    });
  }
  function applyItemChanges(itemQuantities:ItemQuantity[], inventory:UniqueItemQuantitiesList){
    itemQuantities.forEach((itemQuantity) => {
      const item = itemQuantity.getBaseItem();

      //Unconsumed costs can't be reduced, at least by this method, but they can be increased.
      if(itemQuantity.getQuantity() < 0 && unconsumedCosts.includes(item.getKey())) return;

      const existingItemQuantity = inventory.find((existingItemQuantity) => existingItemQuantity.getBaseItem().getKey() == item.getKey());

      if(existingItemQuantity){
        existingItemQuantity.modifyQuantity(itemQuantity.getQuantity());
      }else{
        inventory.modify(itemQuantity);
      }
    });
  }

  function createPassiveRecipeTimeout():NodeJS.Timeout{
    return setTimeout(executePassiveRecipes, settingsManagerContextRef.current.getCorrectTiming(1000));
  }

  function executePassiveRecipes(){
    const sleds:Sled[] = sledsListRef.current;
    sleds.forEach((sled) => {
        const recipe = sled.getPassiveRecipe().convertToRecipe(itemFactoryContext);
        
        if(recipe){
          //If the recipe for the max amount of workers can't be performed, then try the recipe for the next lowest amount of workers.
          for(let i = sled.getWorkers(); i > 0; i--){
            const adjustedRecipe:Recipe = getAdjustedRecipe(recipe, i);
            if(executeRecipe(adjustedRecipe, false)){
              break;
            }
            else{
              continue;
            }
          }
        }
    });

    createPassiveRecipeTimeout();
  }

  function getAdjustedRecipe(recipe:Recipe, workers:number):Recipe{
    const adjustedCosts = recipe.getCosts().map((cost) => {
      const newCost = cost.clone();
      newCost.setQuantity(newCost.getQuantity() * workers);
      return newCost;
    });

    const adjustedResults = recipe.getResults().map((result) => {
      const newResult = result.clone();
      newResult.setQuantity(newResult.getQuantity() * workers);
      return newResult;
    });

    return new Recipe(adjustedCosts, adjustedResults);
  }

  function recipeWillWork(recipe:Recipe):boolean{
    const negativeCosts = getNewQuantitiesThatMatchSign(recipe.getCosts(), -1);
    const newInventory = getInventory().clone();
    applyItemChanges(negativeCosts, newInventory);

    return newInventory.allQuantitiesArePositive();
  }

  function closeEventScreen(){
    setCurrentEvent(null);
  }

  const [locationToClear, setLocationToClear] = useState<IMapLocation|null>(null);
  function clearEventLocation(){
    setLocationToClear(currentEventLocation);
  }

  function clearExplorationInventory(){
    setExplorationInventory((prev) => {
      return new UniqueItemQuantitiesList(
        prev.getListCopy().filter((itemQuantity) => {
          return explorationItemsToKeepOnDeath.itemsToKeep.includes(itemQuantity.getBaseItem().getKey());
        })
      );
    });
  }

  function returnToCaravan(){
    setCurrentEvent(null);
    setCombatEncounterKey(null);
    setMainGameScreen(MainGameScreens.CARAVAN);
  }

  return (
    <SettingsContext.Provider value={{settingsManager:settingsManagerContext, setSettingsManager:setSettingsManagerContext}}>
      <MessageHandlingContext.Provider value={{messageHandling:messageHandlingContext, setMessageHandling:setMessageHandlingContext}}>
        <ItemFactoryContext.Provider value={itemFactoryContext}>
          <ProgressionContext.Provider value={{flags:progressionFlags, setFlags:setProgressionFlags}}>
            <div className="App">
              {mainGameScreen == MainGameScreens.CARAVAN && <CaravanParent inventory={inventory} sleds={sledsList} sellSled={sellSled} setSleds={setSledsList} getInventory={getInventory} setInventory={setInventory} executeRecipe={executeRecipe} workers={workers} setWorkers={setWorkers} 
                explorationInventory={explorationInventory}
                setExplorationInventory={setExplorationInventory}
                setMainGameScreen={setMainGameScreen}
                ></CaravanParent>}
              {mainGameScreen == MainGameScreens.MAP && <MapParent explorationInventory={explorationInventory} currentCombat={combatEncounterKey} savedMap={savedMap} setSavedMap={setSavedMap} currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} setCurrentEventLocation={setCurrentEventLocation} locationToClear={locationToClear} setLocationToClear={setLocationToClear}></MapParent>}
              {currentEvent != null && <EventParent returnToCaravan={returnToCaravan} clearExplorationInventory={clearExplorationInventory} eventId={currentEvent} explorationInventory={explorationInventory} setExplorationInventory={setExplorationInventory} closeEventScreen={closeEventScreen} clearEventLocation={clearEventLocation} setCombatEncounterKey={setCombatEncounterKey}></EventParent>}
              {combatEncounterKey != null && <CombatParent combatEncounterKey={combatEncounterKey} setCombatEncounterKey={setCombatEncounterKey} setCurrentEvent={setCurrentEvent}></CombatParent>}
            </div>
          </ProgressionContext.Provider>
        </ItemFactoryContext.Provider>
      </MessageHandlingContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
export {ProgressionContext, ItemFactoryContext, MessageHandlingContext, ProgressionFlags, MainGameScreens}
export type {ProgressionContextType}
