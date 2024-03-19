import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CraftingSledsList from './CraftingSledsList';

describe('<CraftingSledsList />', () => {
  test('it should mount', () => {
    render(<CraftingSledsList />);
    
    const craftingSledsList = screen.getByTestId('CraftingSledsList');

    expect(craftingSledsList).toBeInTheDocument();
  });
});