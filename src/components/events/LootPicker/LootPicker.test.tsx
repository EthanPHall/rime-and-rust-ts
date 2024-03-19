import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LootPicker from './LootPicker';

describe('<LootPicker />', () => {
  test('it should mount', () => {
    render(<LootPicker />);
    
    const lootPicker = screen.getByTestId('LootPicker');

    expect(lootPicker).toBeInTheDocument();
  });
});