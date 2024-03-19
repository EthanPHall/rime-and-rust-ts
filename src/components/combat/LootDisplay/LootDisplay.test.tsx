import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LootDisplay from './LootDisplay';

describe('<LootDisplay />', () => {
  test('it should mount', () => {
    render(<LootDisplay />);
    
    const lootDisplay = screen.getByTestId('LootDisplay');

    expect(lootDisplay).toBeInTheDocument();
  });
});