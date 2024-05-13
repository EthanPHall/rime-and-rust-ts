import React, { FC, useState } from 'react';
import './ComboSection.css';

interface ComboSectionProps {}

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}
class CombatAction {
  name: string;
  direction: Direction;
  repeat: number;

  constructor(name: string, direction: Direction) {
    this.name = name;
    this.direction = direction;
    this.repeat = 1;
  }

  execute(): void{
    console.log('Executing action');
  }
  incrementRepeat(): void{
    this.repeat++;
  }
  decrementRepeat(): void{
    this.repeat--;
  }
  areEquivalent(action: CombatAction): boolean {
    return this.name === action.name && this.direction === action.direction;
  }
}
class Attack extends CombatAction {
  name = 'Attack';
  direction = Direction.Right;

  constructor() {
    super('Attack', Direction.Right);
  }

  execute() {
    console.log('Attacking');
  }
}
class Block extends  CombatAction {
  name = 'Block';
  direction = Direction.Down;

  constructor() {
    super('Block', Direction.Down);
  }

  execute() {
    console.log('Blocking');
  }
}
class Move extends  CombatAction {
  name = 'Move';
  direction = Direction.Up;

  constructor() {
    super('Move', Direction.Up);

    const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
    const random = Math.floor(Math.random() * directions.length);
    this.direction = directions[random];
  }

  execute() {
    console.log(`Moving ${this.direction}`);
  }
}

const ComboSection: FC<ComboSectionProps> = () => {
  const EXECUTION_DELAY = 600;

  const [actions, setActions] = useState<CombatAction[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  function addAction() {
    const potentialActions: CombatAction[] = [new Attack(), new Block(), new Move()];
    const random:number = Math.floor(Math.random() * potentialActions.length);
    const newAction: CombatAction = potentialActions[random];

    const lastAction: CombatAction = actions[actions.length - 1];
    if (lastAction && lastAction.areEquivalent(newAction)) {
      lastAction.incrementRepeat();
      setActions([...actions]);
      return;
    }

    setActions([...actions, newAction]);
  }

  function cancelActions() {
    setActions([]);
  }

  function removeAction(index: number) {
    actions.splice(index, 1);
    setActions([...actions]);
  }

  function executeActions() {
    if (isExecuting) {
      return;
    }

    //I think in the final project, we can use global context to make sure other components know that we are executing
    setIsExecuting(true);

    let delay = 0;

    for(let i = 0; i < actions.length; i++) {
      const action = actions[i];
      for(let j = 0; j < action.repeat; j++) {
        setTimeout(() => {
          action.execute();
          action.decrementRepeat();
          setActions([...actions]);
        }, delay);

        delay += EXECUTION_DELAY;
      }
    }

    setTimeout(() => {
      setActions([]);
      setIsExecuting(false);
    }, delay);
  }

  return (
    <div className="combo-section" data-testid="combo-section">
      <div className='combo-actions'>
        {
          actions.map((action, index) => (
          <div key={index} className='combo-entry'>{`${action.name} ${action.direction} x${action.repeat}`}</div>
        ))}
      </div>
      <div className='confirm-cancel'>
        <button className='confirm-button' onClick={executeActions}>Confirm</button>
        <button className='cancel-button' onClick={cancelActions}>Cancel</button>
        <button className='add-button' onClick={addAction}>Add Action</button>
      </div>
    </div>
  );
}

export default ComboSection;
