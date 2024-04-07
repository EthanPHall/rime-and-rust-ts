import React, { FC } from 'react';
import './NavButtonSleds.css';

interface NavButtonSledsProps {}

const NavButtonSleds: FC<NavButtonSledsProps> = () => (
  <div className="nav-button-sleds" data-testid="nav-button-sleds">
    <button>Sleds</button>
  </div>
);

export default NavButtonSleds;
