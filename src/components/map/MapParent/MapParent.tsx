import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';

interface MapParentProps {
  setShowEventScreen: (shouldShow:boolean) => void;
}

const MapParent: FC<MapParentProps> = (
  {setShowEventScreen}
) => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map setShowEventScreen={setShowEventScreen}></Map>
        {/* <ExplorationSectionValuables></ExplorationSectionValuables> */}
      </div>
  </div>
);

export default MapParent;
