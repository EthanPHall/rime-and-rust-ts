import React, { FC, useContext } from 'react';
import './CaravanSectionNavBar.css';
import NavButtonCaravan from '../NavButtonCaravan/NavButtonCaravan';
import NavButtonSleds from '../NavButtonSleds/NavButtonSleds';
import NavButtonExploration from '../NavButtonExploration/NavButtonExploration';
import { CaravanSectionNames } from '../CaravanParent/CaravanParent';
import { ProgressionContext, ProgressionContextType } from '../../../App';

interface CaravanSectionNavBarProps {
  setSectionToDisplay: (newSectionName:CaravanSectionNames) => void;
  getSectionBeingDisplayed: () => CaravanSectionNames;
}

const CaravanSectionNavBar: FC<CaravanSectionNavBarProps> = ({setSectionToDisplay, getSectionBeingDisplayed}) => 
{
  const EXPLORATION_UNLOCK_FLAG = "Obtained Reinforced Sled";
  const progressionContext:ProgressionContextType = useContext(ProgressionContext);


  return (
    <div className="caravan-section-navbar" data-testid="caravan-section-navbar">
      <NavButtonCaravan setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonCaravan>
      <span className='divider'>|</span>
      <NavButtonSleds setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonSleds>
      {progressionContext.flags.getFlag(EXPLORATION_UNLOCK_FLAG) && <span className='divider'>|</span>}
      {progressionContext.flags.getFlag(EXPLORATION_UNLOCK_FLAG) && <NavButtonExploration setSectionToDisplay={setSectionToDisplay} getSectionBeingDisplayed={getSectionBeingDisplayed}></NavButtonExploration>}
    </div>
  );
}

export default CaravanSectionNavBar;
