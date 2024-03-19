import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Upgrades from './Upgrades';

describe('<Upgrades />', () => {
  test('it should mount', () => {
    render(<Upgrades />);
    
    const upgrades = screen.getByTestId('Upgrades');

    expect(upgrades).toBeInTheDocument();
  });
});