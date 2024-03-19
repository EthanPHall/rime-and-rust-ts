import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TurnDisplay from './TurnDisplay';

describe('<TurnDisplay />', () => {
  test('it should mount', () => {
    render(<TurnDisplay />);
    
    const turnDisplay = screen.getByTestId('TurnDisplay');

    expect(turnDisplay).toBeInTheDocument();
  });
});