import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CraftableItemsList from './CraftableItemsList';

describe('<CraftableItemsList />', () => {
  test('it should mount', () => {
    render(<CraftableItemsList />);
    
    const craftableItemsList = screen.getByTestId('CraftableItemsList');

    expect(craftableItemsList).toBeInTheDocument();
  });
});