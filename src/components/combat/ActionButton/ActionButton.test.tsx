import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionButton from './ActionButton';

describe('<ActionButton />', () => {
  test('it should mount', () => {
    render(<ActionButton />);
    
    const actionButton = screen.getByTestId('ActionButton');

    expect(actionButton).toBeInTheDocument();
  });
});