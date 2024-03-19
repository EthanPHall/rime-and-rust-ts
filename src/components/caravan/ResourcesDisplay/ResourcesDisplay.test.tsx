import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResourcesDisplay from './ResourcesDisplay';

describe('<ResourcesDisplay />', () => {
  test('it should mount', () => {
    render(<ResourcesDisplay />);
    
    const resourcesDisplay = screen.getByTestId('ResourcesDisplay');

    expect(resourcesDisplay).toBeInTheDocument();
  });
});