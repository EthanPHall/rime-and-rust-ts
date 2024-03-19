import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HazardsDisplay from './HazardsDisplay';

describe('<HazardsDisplay />', () => {
  test('it should mount', () => {
    render(<HazardsDisplay />);
    
    const hazardsDisplay = screen.getByTestId('HazardsDisplay');

    expect(hazardsDisplay).toBeInTheDocument();
  });
});