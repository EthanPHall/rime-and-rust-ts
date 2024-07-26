import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';

interface MapParentProps {
  setCurrentEvent: React.Dispatch<React.SetStateAction<string | null>>
}

const MapParent: FC<MapParentProps> = (
  {setCurrentEvent}
) => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map setCurrentEvent={setCurrentEvent}></Map>
        {/* <ExplorationSectionValuables></ExplorationSectionValuables> */}
      </div>
  </div>
);

export default MapParent;
