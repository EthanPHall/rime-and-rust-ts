import React, { FC } from 'react';
import './CaravanSectionNavBar.css';
import NavButtonCaravan from '../NavButtonCaravan/NavButtonCaravan';
import NavButtonSleds from '../NavButtonSleds/NavButtonSleds';
import NavButtonExploration from '../NavButtonExploration/NavButtonExploration';
import { CaravanSectionNames } from '../CaravanParent/CaravanParent';

interface CaravanSectionNavBarProps {
  setSectionToDisplay: (newSectionName:CaravanSectionNames) => void;
  getSectionBeingDisplayed: () => CaravanSectionNames;
}

const CaravanSectionNavBar: FC<CaravanSectionNavBarProps> = ({setSectionToDisplay, getSectionBeingDisplayed}) => (
  <div className="caravan-section-navbar" data-testid="caravan-section-navbar">
    <NavButtonCaravan setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonCaravan>
    <span className='divider'>|</span>
    <NavButtonSleds setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonSleds>
    <span className='divider'>|</span>
    <NavButtonExploration setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonExploration>
  </div>
);

export default CaravanSectionNavBar;
