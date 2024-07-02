import React, { FC } from 'react';
import './NavButtonSleds.css';
import { CaravanSectionNames } from '../CaravanParent/CaravanParent';

interface NavButtonSledsProps {
  setSectionToDisplay: (newSectionName:CaravanSectionNames) => void;
  getSectionBeingDisplayed: () => CaravanSectionNames;
}

const NavButtonSleds: FC<NavButtonSledsProps> = ({setSectionToDisplay, getSectionBeingDisplayed}) => (
  <div className="nav-button-sleds" data-testid="nav-button-sleds">
    <button className={`${getSectionBeingDisplayed() == CaravanSectionNames.SLEDS && 'active-section-button'}`} onClick={() => {setSectionToDisplay(CaravanSectionNames.SLEDS)}}>Sleds</button>
  </div>
);

export default NavButtonSleds;
