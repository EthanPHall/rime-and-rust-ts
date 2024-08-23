import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import './EventParent.css';
import EventSection from '../EventSection/EventSection';
import InventoryPicker from '../InventoryPicker/InventoryPicker';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import { UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import InventoryTransferer from '../InventoryTransferer/InventoryTransferer';
import IRimeEventScene from '../../../classes/events/IRimeEventScene';
import IRimeEventAction from '../../../classes/events/IRimeEventAction';
import RimeEventActionClose from '../../../classes/events/RimeEventActionClose';
import { ItemFactoryContext } from '../../../App';
import IRimeEventFactory from '../../../classes/events/IRimeEventFactory';
import RimeEventFactoryJSON from '../../../classes/events/RimeEventFactoryJSON';
import IRimeEvent from '../../../classes/events/IRimeEvent';
import RimeEventSceneRewards from '../../../classes/events/RimeEventSceneRewards';
import eventJSONData from "../../../data/event/events.json";
import ICombatEncounter from '../../../classes/combat/ICombatEncounter';
import RimeEventSceneActionOnly from '../../../classes/events/RimeEventSceneActionOnly';
import { SettingsContext } from '../../../context/misc/SettingsContext';

interface EventParentProps {
  eventId:string
  explorationInventory:UniqueItemQuantitiesList
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>
  closeEventScreen:() =>void
  clearEventLocation:() => void
  setCombatEncounterKey: (newEncounter: string|null) => void
  clearExplorationInventory: () => void,
  returnToCaravan:() => void
}

const EventParent: FC<EventParentProps> = (
  {
    eventId,
    explorationInventory,
    setExplorationInventory,
    closeEventScreen,
    clearEventLocation,
    setCombatEncounterKey,
    clearExplorationInventory,
    returnToCaravan
  }
) => {
  const settingsContext = useContext(SettingsContext);
  
  const [rewardsInventory, setRewardsInventory] = useState<UniqueItemQuantitiesList|null>(null);
  

  const [defaultScene] = useState<IRimeEventScene>(
    {
      getKey():number{return 0;},
      getType():string{return "default";},
      getText():string{return "Default scene"},
      getOptions():IRimeEventAction[]{return [
        new RimeEventActionClose(closeEventScreen)
      ]},
      executOption(option:IRimeEventAction):void{
        option.execute();
      }
    }
  )

  
  const itemFactory = useContext(ItemFactoryContext);
  const [sceneKey, setSceneKey] = useState<number>(1);
  
  const [rimeEventFactory, setRimeEventFactory] = useState<IRimeEventFactory>(
    new RimeEventFactoryJSON(itemFactory, setSceneKey, closeEventScreen, clearEventLocation, setCombatEncounterKey, clearExplorationInventory, returnToCaravan, settingsContext.settingsManager.getNextRandomNumber)
  )

  const [currentEvent, setCurrentEvent] = useState<IRimeEvent>(
    rimeEventFactory.createEventById(eventId)
  )
  
  const [currentScene, setCurrentScene] = useState<IRimeEventScene>(defaultScene);
  
  const [sceneIsInvisible, setSceneIsInvisible] = useState<boolean>(false)
  
  useEffect(() => {
    setCurrentEvent(rimeEventFactory.createEventById(eventId));
    setSceneKey(1);
  }, [eventId])

  useEffect(() => {
    const newScene = currentEvent.getScenes().find((scene) => {
      return scene.getKey() == sceneKey;
    });

    if(newScene && newScene instanceof RimeEventSceneActionOnly){
      newScene.executOption(newScene.getOptions()[0]);
      setSceneIsInvisible(true);  
    }
    else if(newScene && newScene instanceof RimeEventSceneRewards){
      setRewardsInventory(newScene.getRewards());
    }
    else{
      setRewardsInventory(null);
    }

    setCurrentScene(newScene || defaultScene);
  }, [sceneKey])

  return (
  <div className="event-parent" data-testid="event-parent">
      <div className='event-parent-grid-parent'>
      {!sceneIsInvisible &&
        <>
          <EventSection 
            eventId={eventId} 
            explorationInventory={explorationInventory} 
            setExplorationInventory={setExplorationInventory}
            currentEvent={currentEvent}
            currentScene={currentScene}
            rewardsInventory={rewardsInventory}
            setRewardsInventory={setRewardsInventory}
          ></EventSection>
          {currentScene.getType() == eventJSONData.sceneTypes.rewards && rewardsInventory && <InventoryTransferer
            toInventory={rewardsInventory}
            setToInventory={setRewardsInventory as React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>}
            fromInventory={explorationInventory}
            setFromInventory={setExplorationInventory }
          ></InventoryTransferer>}
        </>
      }
    </div>
  </div>
);}

export default EventParent;
