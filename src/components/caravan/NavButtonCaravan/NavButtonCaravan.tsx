import React, { FC } from 'react';
import './NavButtonCaravan.css';

interface NavButtonCaravanProps {}

const NavButtonCaravan: FC<NavButtonCaravanProps> = () => (
  <div className="nav-button-caravan" data-testid="nav-button-caravan">
    <button>Caravan</button>
  </div>
);

export default NavButtonCaravan;
