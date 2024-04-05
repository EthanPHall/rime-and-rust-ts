import React, { FC } from 'react';
import './MapParent.css';

interface MapParentProps {}

const MapParent: FC<MapParentProps> = () => (
  <div className="map-parent" data-testid="map-parent">
      <div className='grid-parent'>
        <div className='messages'>
          Messages
        </div>
        <div className='map'>
          Map
        </div>
        <div className='inventory'>
          Inventory
        </div>
      </div>
  </div>
);

export default MapParent;
