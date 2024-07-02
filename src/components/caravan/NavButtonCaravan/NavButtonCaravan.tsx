import React, { FC } from 'react';
import './NavButtonCaravan.css';
import { CaravanSectionNames } from '../CaravanParent/CaravanParent';

interface NavButtonCaravanProps {
  setSectionToDisplay: (newSectionName:CaravanSectionNames) => void;
  getSectionBeingDisplayed: () => CaravanSectionNames;
}

const NavButtonCaravan: FC<NavButtonCaravanProps> = ({setSectionToDisplay, getSectionBeingDisplayed}) => (
  <div className="nav-button-caravan" data-testid="nav-button-caravan">
    <button className={`${getSectionBeingDisplayed() == CaravanSectionNames.CRAFTING && 'active-section-button'}`} onClick={() => {setSectionToDisplay(CaravanSectionNames.CRAFTING)}}>Caravan</button>
  </div>
);

export default NavButtonCaravan;
