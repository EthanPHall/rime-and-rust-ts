import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CombatMapLocation from './CombatMapLocation';

describe('<CombatMapLocation />', () => {
  test('it should mount', () => {
    render(<CombatMapLocation />);
    
    const combatMapLocation = screen.getByTestId('CombatMapLocation');

    expect(combatMapLocation).toBeInTheDocument();
  });
});