import React, { FC } from 'react';
import './Map.css';

interface MapProps {}

const Map: FC<MapProps> = () => (
  <div className="Map" data-testid="Map">
    Map Component
  </div>
);

export default Map;
