import React, { FC } from 'react';
import './NavButtonExploration.css';
import { CaravanSectionNames } from '../CaravanParent/CaravanParent';

interface NavButtonExplorationProps {
  setSectionToDisplay: (newSectionName:CaravanSectionNames) => void;
  getSectionBeingDisplayed: () => CaravanSectionNames;
}

const NavButtonExploration: FC<NavButtonExplorationProps> = ({setSectionToDisplay, getSectionBeingDisplayed}) => (
  <div className="nav-button-exploration" data-testid="nav-button-exploration">
    <button className={`${getSectionBeingDisplayed() == CaravanSectionNames.EXPLORATION && 'active-section-button'}`}  onClick={() => {setSectionToDisplay(CaravanSectionNames.EXPLORATION)}}>Explore</button>
  </div>
);

export default NavButtonExploration;
