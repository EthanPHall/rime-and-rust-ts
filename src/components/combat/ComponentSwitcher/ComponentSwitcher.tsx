import React, { FC } from 'react';
import './ComponentSwitcher.css';

interface ComponentSwitcherProps {}

const ComponentSwitcher: FC<ComponentSwitcherProps> = () => (
  <div className="component-switcher" data-testid="component-switcher">
    ComponentSwitcher Component
  </div>
);

export default ComponentSwitcher;
