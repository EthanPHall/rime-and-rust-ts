import React, { FC, useState } from 'react';
import './MapLocation.css';
import { GetRandomBackgroundLocation, MapLocationData } from '../../../data/map-location-data/MapLocationDataHandler';

interface MapLocationProps {}

const MapLocation: FC<MapLocationProps> = () => {

  const [mapLocation, setMapLocation] = useState<MapLocationData>(GetRandomBackgroundLocation());

  return(
    <span className="map-location" data-testid="map-location">
      {mapLocation.symbol}
    </span>
  );
}

export default MapLocation;
