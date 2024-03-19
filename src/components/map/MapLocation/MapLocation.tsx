import React, { FC } from 'react';
import './MapLocation.css';

interface MapLocationProps {}

const MapLocation: FC<MapLocationProps> = () => (
  <div className="MapLocation" data-testid="MapLocation">
    MapLocation Component
  </div>
);

export default MapLocation;
