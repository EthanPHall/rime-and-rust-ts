import React, { FC } from 'react';
import './ComponentSwitcher.css';
import EnemiesDisplay from '../EnemiesDisplay/EnemiesDisplay';
import HazardsDisplay from '../HazardsDisplay/HazardsDisplay';

interface ComponentSwitcherProps {}

class SwitchedComponent{
  component: JSX.Element;
  name: string;
  constructor(component: JSX.Element, name: string){
    this.component = component;
    this.name = name;
  }
}

const ComponentSwitcher: FC<ComponentSwitcherProps> = () => {
  const [index, setIndex] = React.useState<number>(0);
  const [components, setComponents] = React.useState<SwitchedComponent[]>([
    new SwitchedComponent(<EnemiesDisplay></EnemiesDisplay>, 'Enemies'),
    new SwitchedComponent(<HazardsDisplay></HazardsDisplay>, 'Hazards'),
    // new SwitchedComponent(<div>Buh</div>, 'Buh')
  ]);
  
  function incrementIndex(){
    setIndex((index + 1) % components.length);
  }
  function decrementIndex(){
    setIndex((index - 1 + components.length) % components.length);
  }

  const toDisplay: JSX.Element = index == 0 ? <EnemiesDisplay></EnemiesDisplay> : <HazardsDisplay></HazardsDisplay>;

  return (
    <div className="component-switcher" data-testid="component-switcher">
      <div className='title-section'>
        <span className='left-arrow' onClick={decrementIndex}>{`<`}</span>
        {components[index].name}
        <span className='right-arrow' onClick={incrementIndex}>{`>`}</span>
      </div>
      {components[index].component}
    </div>
  );
}

export default ComponentSwitcher;
