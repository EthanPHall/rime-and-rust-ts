import React, { FC } from 'react';
import './MapRow.css';

interface MapRowProps {}

const MapRow: FC<MapRowProps> = () => (
  <div className="MapRow" data-testid="MapRow">
    MapRow Component
  </div>
);

export default MapRow;
