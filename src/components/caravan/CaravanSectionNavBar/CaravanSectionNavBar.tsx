import React, { FC } from 'react';
import './CaravanSectionNavBar.css';
import NavButtonCaravan from '../NavButtonCaravan/NavButtonCaravan';
import NavButtonSleds from '../NavButtonSleds/NavButtonSleds';
import NavButtonExploration from '../NavButtonExploration/NavButtonExploration';

interface CaravanSectionNavBarProps {}

const CaravanSectionNavBar: FC<CaravanSectionNavBarProps> = () => (
  <div className="caravan-section-navbar" data-testid="caravan-section-navbar">
    <NavButtonCaravan></NavButtonCaravan>
    <span className='divider'>|</span>
    <NavButtonSleds></NavButtonSleds>
    <span className='divider'>|</span>
    <NavButtonExploration></NavButtonExploration>
  </div>
);

export default CaravanSectionNavBar;
