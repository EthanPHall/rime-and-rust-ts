import React, { FC } from 'react';
import './NavButtonCaravan.css';

interface NavButtonCaravanProps {}

const NavButtonCaravan: FC<NavButtonCaravanProps> = () => (
  <div className="NavButtonCaravan" data-testid="NavButtonCaravan">
    NavButtonCaravan Component
  </div>
);

export default NavButtonCaravan;
