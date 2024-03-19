import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ComboEntry from './ComboEntry';

describe('<ComboEntry />', () => {
  test('it should mount', () => {
    render(<ComboEntry />);
    
    const comboEntry = screen.getByTestId('ComboEntry');

    expect(comboEntry).toBeInTheDocument();
  });
});