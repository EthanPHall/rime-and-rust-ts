import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResourceEntry from './ResourceEntry';

describe('<ResourceEntry />', () => {
  test('it should mount', () => {
    render(<ResourceEntry />);
    
    const resourceEntry = screen.getByTestId('ResourceEntry');

    expect(resourceEntry).toBeInTheDocument();
  });
});