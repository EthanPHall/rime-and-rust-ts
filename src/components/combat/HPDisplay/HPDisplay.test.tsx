import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HpDisplay from './HpDisplay';

describe('<HpDisplay />', () => {
  test('it should mount', () => {
    render(<HpDisplay />);
    
    const hpDisplay = screen.getByTestId('HpDisplay');

    expect(hpDisplay).toBeInTheDocument();
  });
});