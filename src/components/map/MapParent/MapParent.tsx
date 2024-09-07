import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import IMapLocation from '../../../classes/exploration/IMapLocation';
import IMap from '../../../classes/exploration/IMap';
import { Equipment, Resource, ResourceQuantity, UniqueItemQuantitiesList } from '../../../classes/caravan/Item';

interface MapParentProps {
  explorationInventory:UniqueItemQuantitiesList
  currentCombat:string|null
  currentEvent:string|null
  setCurrentEvent: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentEventLocation: React.Dispatch<React.SetStateAction<IMapLocation | null>>
  locationToClear:IMapLocation|null
  setLocationToClear:React.Dispatch<React.SetStateAction<IMapLocation | null>>
  savedMap:IMap|null
  setSavedMap:React.Dispatch<React.SetStateAction<IMap | null>>
  saveGame:() => void;
}

const MapParent: FC<MapParentProps> = (
  {
    explorationInventory,
    currentCombat,
    currentEvent,
    setCurrentEvent,
    setCurrentEventLocation,
    locationToClear,
    setLocationToClear,
    savedMap,
    setSavedMap,
    saveGame
  }
) => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map saveGame={saveGame} currentCombat={currentCombat} savedMap={savedMap} setSavedMap={setSavedMap} currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} setCurrentEventLocation={setCurrentEventLocation} locationToClear={locationToClear} setLocationToClear={setLocationToClear}></Map>
        <CaravanSectionValuables resources={Resource.pickOutResourceQuantities(explorationInventory)} equipment={Equipment.pickOutEquipmentQuantities(explorationInventory)} dogs={[]} displayDogsInput={false}></CaravanSectionValuables>
      </div>
  </div>
);

export default MapParent;
