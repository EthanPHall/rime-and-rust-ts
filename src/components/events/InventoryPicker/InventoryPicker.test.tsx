import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InventoryPicker from './InventoryPicker';

describe('<InventoryPicker />', () => {
  test('it should mount', () => {
    render(<InventoryPicker />);
    
    const inventoryPicker = screen.getByTestId('InventoryPicker');

    expect(inventoryPicker).toBeInTheDocument();
  });
});