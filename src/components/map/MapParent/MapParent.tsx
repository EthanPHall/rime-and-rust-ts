import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';
import IMapLocation from '../../../classes/exploration/IMapLocation';

interface MapParentProps {
  currentEvent:string|null
  setCurrentEvent: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentEventLocation: React.Dispatch<React.SetStateAction<IMapLocation | null>>
  locationToClear:IMapLocation|null
  setLocationToClear:React.Dispatch<React.SetStateAction<IMapLocation | null>>
}

const MapParent: FC<MapParentProps> = (
  {
    currentEvent,
    setCurrentEvent,
    setCurrentEventLocation,
    locationToClear,
    setLocationToClear
  }
) => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} setCurrentEventLocation={setCurrentEventLocation} locationToClear={locationToClear} setLocationToClear={setLocationToClear}></Map>
        {/* <ExplorationSectionValuables></ExplorationSectionValuables> */}
      </div>
  </div>
);

export default MapParent;
