import React, { FC } from 'react';
import './ComponentSwitcher.css';
import EnemiesDisplay from '../EnemiesDisplay/EnemiesDisplay';
import HazardsDisplay from '../HazardsDisplay/HazardsDisplay';

interface ComponentSwitcherProps {}

const ComponentSwitcher: FC<ComponentSwitcherProps> = () => (
  <div className="component-switcher" data-testid="component-switcher">
    <div className='title-section'>
      <span className='left-arrow'>{`<`}</span> Hazards <span className='right-arrow'>{`>`}</span>
    </div>
    {/* <EnemiesDisplay></EnemiesDisplay> */}
    <HazardsDisplay></HazardsDisplay>
  </div>
);

export default ComponentSwitcher;
