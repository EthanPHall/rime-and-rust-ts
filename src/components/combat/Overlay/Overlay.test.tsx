import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Overlay from './Overlay';

describe('<Overlay />', () => {
  test('it should mount', () => {
    render(<Overlay />);
    
    const overlay = screen.getByTestId('Overlay');

    expect(overlay).toBeInTheDocument();
  });
});