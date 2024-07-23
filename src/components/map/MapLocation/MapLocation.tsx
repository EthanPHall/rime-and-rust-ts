import React, { FC, useState } from 'react';
import './MapLocation.css';
import MapLocationData from '../../../classes/exploration/MapLocationData';
import IMapLocationVisual from '../../../classes/exploration/IMapLocationVisual';
import { color } from 'framer-motion';
import {motion} from 'framer-motion';

interface MapLocationProps {
  locationVisual: IMapLocationVisual;
}

const MapLocation: FC<MapLocationProps> = (
  { locationVisual }
) => {

  return(
    <motion.span className={`map-location ${locationVisual.getStyles()}`} data-testid="map-location"
      animate={locationVisual.getAnimation()}
    >
      {locationVisual.getSymbol()}
    </motion.span>
  );
}

export default MapLocation;
