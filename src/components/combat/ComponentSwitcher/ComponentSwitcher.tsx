import React, { FC } from 'react';
import './ComponentSwitcher.css';

interface ComponentSwitcherProps {}

const ComponentSwitcher: FC<ComponentSwitcherProps> = () => (
  <div className="ComponentSwitcher" data-testid="ComponentSwitcher">
    ComponentSwitcher Component
  </div>
);

export default ComponentSwitcher;
