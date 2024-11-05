import React, { FC, useContext, useEffect, useState } from 'react';
import './EventSection.css';
import LootPicker from '../LootPicker/LootPicker';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import IRimeEventFactory from '../../../classes/events/IRimeEventFactory';
import RimeEventFactoryJSON from '../../../classes/events/RimeEventFactoryJSON';
import IRimeEvent from '../../../classes/events/IRimeEvent';
import IRimeEventScene from '../../../classes/events/IRimeEventScene';
import IRimeEventAction from '../../../classes/events/IRimeEventAction';
import RimeEventActionClose from '../../../classes/events/RimeEventActionClose';
import eventRawData from "../../../data/event/events.json";
import { ItemFactoryContext } from '../../../App';
import RimeEventSceneRewards from '../../../classes/events/RimeEventSceneRewards';
import ExplorationResourcesPicker from '../../caravan/ExplorationResourcesPicker/ExplorationResourcesPicker';
import { UniqueItemQuantitiesList } from '../../../classes/caravan/Item';
import InventoryTransferer from '../InventoryTransferer/InventoryTransferer';
import HoverButton from '../../misc/HoverButton/HoverButton';

interface EventSectionProps {
  eventId:string,
  explorationInventory:UniqueItemQuantitiesList,
  setExplorationInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>,
  currentEvent:IRimeEvent,
  currentScene:IRimeEventScene,
  rewardsInventory:UniqueItemQuantitiesList|null,
  setRewardsInventory:React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList | null>>
}

const EventSection: FC<EventSectionProps> = (
  {
    eventId,
    explorationInventory,
    setExplorationInventory,
    currentEvent,
    currentScene,
    rewardsInventory,
    setRewardsInventory
  }
) => {

  function inventoryHasRequisiteItems(requisiteItems:string[]):boolean{
    for(let requisiteItem of requisiteItems){
      if(!explorationInventory.find((item) => item.getBaseItem().getKey() == requisiteItem && item.getQuantity() > 0)){
        return false;
      }
    }
    return true;
  }

  return (
  <div className="event-section" data-testid="event-section">
    <div className='title'>{currentEvent.getName()}</div>
    <div className='content-section'>
      <div className='content-text'>{currentScene.getText()}</div>
      <div className='content-transfer'>
        {currentScene.getType() == eventRawData.sceneTypes.rewards && rewardsInventory && <InventoryTransferer
          toInventory={explorationInventory}
          setToInventory={setExplorationInventory}
          fromInventory={rewardsInventory}
          setFromInventory={setRewardsInventory as React.Dispatch<React.SetStateAction<UniqueItemQuantitiesList>>}
        ></InventoryTransferer>}
      </div>
    </div>
    <div className='buttons'>
      {
        currentScene.getOptions()?.[1] && 
          <HoverButton 
            buttonText={currentScene.getOptions()[1].getName()}
            popupText={currentScene.getOptions()[1].getRequisiteItems().length > 0 ? `Requires:\n${currentScene.getOptions()[1].getRequisiteItems().join("\n")}` : ""}
            onClick={() => {currentScene.getOptions()[1].execute()}}
            greyedOut={!inventoryHasRequisiteItems(currentScene.getOptions()[1].getRequisiteItems())}
          ></HoverButton>
      }
      {
        currentScene.getOptions()?.[0] && 
          <HoverButton 
            buttonText={currentScene.getOptions()[0].getName()}
            popupText={currentScene.getOptions()[0].getRequisiteItems().length > 0 ? `Requires:\n${currentScene.getOptions()[0].getRequisiteItems().join("\n")}` : ""}
            onClick={() => {currentScene.getOptions()[0].execute()}}
            greyedOut={!inventoryHasRequisiteItems(currentScene.getOptions()[0].getRequisiteItems())}  
          ></HoverButton>
      }    
    </div>
  </div>
)};

export default EventSection;
