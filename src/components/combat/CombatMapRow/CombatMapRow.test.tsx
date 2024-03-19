import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CombatMapRow from './CombatMapRow';

describe('<CombatMapRow />', () => {
  test('it should mount', () => {
    render(<CombatMapRow />);
    
    const combatMapRow = screen.getByTestId('CombatMapRow');

    expect(combatMapRow).toBeInTheDocument();
  });
});