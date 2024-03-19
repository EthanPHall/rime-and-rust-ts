import React, { FC } from 'react';
import './MapParent.css';

interface MapParentProps {}

const MapParent: FC<MapParentProps> = () => (
  <div className="MapParent" data-testid="MapParent">
    MapParent Component
  </div>
);

export default MapParent;
