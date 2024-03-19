import React, { FC } from 'react';
import './DogsList.css';

interface DogsListProps {}

const DogsList: FC<DogsListProps> = () => (
  <div className="DogsList" data-testid="DogsList">
    DogsList Component
  </div>
);

export default DogsList;
