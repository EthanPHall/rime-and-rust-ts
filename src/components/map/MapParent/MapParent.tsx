import React, { FC } from 'react';
import './MapParent.css';
import MessagesParent from '../../messages/MessagesParent/MessagesParent';
import CaravanSectionValuables from '../../caravan/CaravanSectionValuables/CaravanSectionValuables';
import Map from '../Map/Map';

interface MapParentProps {}

const MapParent: FC<MapParentProps> = () => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <MessagesParent></MessagesParent>
        <Map></Map>
        {/* <ExplorationSectionValuables></ExplorationSectionValuables> */}
      </div>
  </div>
);

export default MapParent;
