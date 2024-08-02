import React, { FC, useEffect, useState } from 'react';
import './MapLocation.css';
import MapLocationData from '../../../classes/exploration/MapLocationData';
import IMapLocationVisual from '../../../classes/exploration/IMapLocationVisual';
import { color } from 'framer-motion';
import {motion} from 'framer-motion';
import Vector2 from '../../../classes/utility/Vector2';

interface MapLocationProps {
  locationVisual: IMapLocationVisual;
  visibleLocations: boolean[][];
  position:Vector2
}

const MapLocation: FC<MapLocationProps> = (
  { 
    locationVisual, 
    visibleLocations,
    position
  }
) => {

  useEffect(()=>{
    if(position.x == 0){
      console.log(locationVisual.getStyles());
    }
  },[visibleLocations])

  return(
    <motion.span className={`map-location ${locationVisual.getStyles()} ${(visibleLocations[position.y][position.x]) ? "" : "invisible"}`} data-testid="map-location"
      animate={locationVisual.getAnimation()}
    >
      {locationVisual.getSymbol()}
    </motion.span>
  );
}

export default MapLocation;