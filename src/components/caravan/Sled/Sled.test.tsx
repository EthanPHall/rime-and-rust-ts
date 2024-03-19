import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sled from './Sled';

describe('<Sled />', () => {
  test('it should mount', () => {
    render(<Sled />);
    
    const sled = screen.getByTestId('Sled');

    expect(sled).toBeInTheDocument();
  });
});