import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import IMapLocation from '../../../classes/exploration/IMapLocation';
import IMap from '../../../classes/exploration/IMap';

interface MapParentProps {
  currentCombat:string|null
  currentEvent:string|null
  setCurrentEvent: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentEventLocation: React.Dispatch<React.SetStateAction<IMapLocation | null>>
  locationToClear:IMapLocation|null
  setLocationToClear:React.Dispatch<React.SetStateAction<IMapLocation | null>>
  savedMap:IMap|null
  setSavedMap:React.Dispatch<React.SetStateAction<IMap | null>>
}

const MapParent: FC<MapParentProps> = (
  {
    currentCombat,
    currentEvent,
    setCurrentEvent,
    setCurrentEventLocation,
    locationToClear,
    setLocationToClear,
    savedMap,
    setSavedMap
  }
) => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map currentCombat={currentCombat} savedMap={savedMap} setSavedMap={setSavedMap} currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} setCurrentEventLocation={setCurrentEventLocation} locationToClear={locationToClear} setLocationToClear={setLocationToClear}></Map>
        {/* <ExplorationSectionValuables></ExplorationSectionValuables> */}
      </div>
  </div>
);

export default MapParent;
