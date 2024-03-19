import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Gradient from './Gradient';

describe('<Gradient />', () => {
  test('it should mount', () => {
    render(<Gradient />);
    
    const gradient = screen.getByTestId('Gradient');

    expect(gradient).toBeInTheDocument();
  });
});