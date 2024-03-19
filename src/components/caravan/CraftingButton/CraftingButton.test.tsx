import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CraftingButton from './CraftingButton';

describe('<CraftingButton />', () => {
  test('it should mount', () => {
    render(<CraftingButton />);
    
    const craftingButton = screen.getByTestId('CraftingButton');

    expect(craftingButton).toBeInTheDocument();
  });
});