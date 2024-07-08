import React, { createContext, useEffect, useState } from 'react';
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

function App() {
  const [progressionFlags, setProgressionFlags] = React.useState<ProgressionFlags>(new ProgressionFlags(progressionFlagsData));
  const [messageHandlingContext, setMessageHandlingContext] = React.useState<MessageContext>(new MessageContext(messageFactory, messageManager));

  const [inventory, getInventory, setInventory] = useRefState<UniqueItemQuantitiesList>(new UniqueItemQuantitiesList([]));

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

  const itemFactoryContext = new ItemFactoryJSON(getExistingSledCount);



  //This function will be passed as props, so I'm using getInventory() instead of inventory
  function executeRecipe(recipe:Recipe){
    const negativeCosts = getNewQuantitiesThatMatchSign(recipe.getCosts(), -1);
    const newInventory = getInventory().deepClone(itemFactoryContext);

    if(!arePrerequisitesMet(recipe, newInventory)){
      return;
    }

    applyItemChanges(negativeCosts, newInventory);

    if(!newInventory.allQuantitiesArePositive()){
      const recipeFail:RecipeFail = new RecipeFail(
        recipe,
        newInventory.getNegativeQuantities().map((quantity) => {
          return quantity.getItem().getName()
        })
      );

      messageHandlingContext.getManager().addMessage(messageHandlingContext.getFactory().createFailedRecipeMessage(recipeFail));
      setMessageHandlingContext(messageHandlingContext.clone());

      return;
    }

    applyItemChanges(recipe.getResults(), newInventory);
    setInventory(newInventory);
  }



  function arePrerequisitesMet(recipe:Recipe, inventory:UniqueItemQuantitiesList):boolean{
    //Define a new type that stores an ItemQuantity and a boolean
    type ItemQuantityBool = {itemQuantity:ItemQuantity, bool:boolean};

    //Get a list of item quantities from the recipe arg where the items are in the unconsumedCosts list, 
    //and map that list to a new list of ItemQuantityBooleans
    const itemQuantityBooleans:ItemQuantityBool[] = recipe.getCosts().filter((cost) => {
      return unconsumedCosts.includes(cost.getItem().getKey());
    }).map((cost) => {
      return {itemQuantity:cost, bool:false};
    });

    //Check the inventory for each item in that list and see if there are enough of the prerequisite items in inventory. 
    //If so, set the boolean to true. If not, set the boolean to false.
    itemQuantityBooleans.forEach((itemQuantityBool) => {
      const iqbItem:IItem = itemQuantityBool.itemQuantity.getItem();
      const iqbQuantity:number = itemQuantityBool.itemQuantity.getQuantity();

      if(inventory.find((itemQuantity) => itemQuantity.getItem().getKey() == iqbItem.getKey() && itemQuantity.getQuantity() >= iqbQuantity) != undefined){
        itemQuantityBool.bool = true;
      }
    });

    //If there are any booleans that are false, return early. Construct a failed recipe that includes only the prerequisites that wrren't met.
    if(itemQuantityBooleans.find((itemQuantityBool) => itemQuantityBool.bool == false)){
      const recipeFail:RecipeFail = new RecipeFail(
        recipe,
        itemQuantityBooleans.filter((itemQuantityBool) => itemQuantityBool.bool == false).map((itemQuantityBool) => {
          return itemQuantityBool.itemQuantity.getItem().getName();
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

      //Unconsumed costs can't be reduced, at least by this method, but they can be increased.
      if(itemQuantity.getQuantity() < 0 && unconsumedCosts.includes(item.getKey())) return;

      const existingItemQuantity = inventory.find((existingItemQuantity) => existingItemQuantity.getItem().getKey() == item.getKey());

      if(existingItemQuantity){
        existingItemQuantity.setQuantity(existingItemQuantity.getQuantity() + itemQuantity.getQuantity());
      }else{
        inventory.modify(itemQuantity);
      }
    });
  }


  useEffect(() => {
    setTimeout(executePassiveRecipes, 10000);
  }, [])

  function executePassiveRecipes(){
    console.log('Executing passive recipes');

    const sleds:SledQuantity[] = Sled.pickOutSledQuantities(getInventory());
    sleds.forEach((sledQuantity) => {
      const sled = sledQuantity.getSled();
      const recipe = sled.getPassiveRecipe().convertToRecipe(itemFactoryContext);

      if(recipe){
        for(let i = sled.getWorkers(); i > 0; i--){
          const adjustedRecipe:Recipe = getAdjustedRecipe(recipe, i);
          if(recipeWillWork(adjustedRecipe)){
            executeRecipe(adjustedRecipe);
          }
          else{
            continue;
          }
        }
      }
    });

    setTimeout(executePassiveRecipes, 10000);
  }

  function getAdjustedRecipe(recipe:Recipe, workers:number):Recipe{
    const adjustedCosts = recipe.getCosts().map((cost) => {
      const newCost = cost.deepClone(itemFactoryContext);
      newCost.setQuantity(newCost.getQuantity() * workers);
      return newCost;
    });

    const adjustedResults = recipe.getResults().map((result) => {
      const newResult = result.deepClone(itemFactoryContext);
      newResult.setQuantity(newResult.getQuantity() * workers);
      return newResult;
    });

    return new Recipe(adjustedCosts, adjustedResults);
  }

  function recipeWillWork(recipe:Recipe):boolean{
    const negativeCosts = getNewQuantitiesThatMatchSign(recipe.getCosts(), -1);
    const newInventory = getInventory().deepClone(itemFactoryContext);
    applyItemChanges(negativeCosts, newInventory);

    return newInventory.allQuantitiesArePositive();
  }
  
  return (
    <MessageHandlingContext.Provider value={{messageHandling:messageHandlingContext, setMessageHandling:setMessageHandlingContext}}>
      <ItemFactoryContext.Provider value={itemFactoryContext}>
        <ProgressionContext.Provider value={{flags:progressionFlags, setFlags:setProgressionFlags}}>
          <div className="App">
            {/* <EventParent></EventParent> */}
            {/* <CombatParent></CombatParent> */}
            <CaravanParent inventory={inventory} getInventory={getInventory} setInventory={setInventory} executeRecipe={executeRecipe}></CaravanParent>
            {/* <MapParent></MapParent> */}
          </div>
        </ProgressionContext.Provider>
      </ItemFactoryContext.Provider>
    </MessageHandlingContext.Provider>
  );
}

export default App;
export {ProgressionContext, ItemFactoryContext, MessageHandlingContext, ProgressionFlags}
export type {ProgressionContextType}
