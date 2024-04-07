import React, { FC } from 'react';
import './CaravanSectionNavBar.css';
import NavButtonCaravan from '../NavButtonCaravan/NavButtonCaravan';
import NavButtonSleds from '../NavButtonSleds/NavButtonSleds';
import NavButtonExploration from '../NavButtonExploration/NavButtonExploration';

interface CaravanSectionNavBarProps {}

const CaravanSectionNavBar: FC<CaravanSectionNavBarProps> = () => (
  <div className="CaravanSectionNavBar" data-testid="CaravanSectionNavBar">
    <NavButtonCaravan></NavButtonCaravan>
    <NavButtonSleds></NavButtonSleds>
    <NavButtonExploration></NavButtonExploration>
  </div>
);

export default CaravanSectionNavBar;
