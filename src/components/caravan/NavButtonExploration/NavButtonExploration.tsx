import React, { FC } from 'react';
import './NavButtonExploration.css';

interface NavButtonExplorationProps {}

const NavButtonExploration: FC<NavButtonExplorationProps> = () => (
  <div className="nav-button-exploration" data-testid="nav-button-exploration">
    <button className='active-section-button'>Explore</button>
  </div>
);

export default NavButtonExploration;
