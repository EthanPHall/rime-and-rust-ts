import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MapRow from './MapRow';

describe('<MapRow />', () => {
  test('it should mount', () => {
    render(<MapRow />);
    
    const mapRow = screen.getByTestId('MapRow');

    expect(mapRow).toBeInTheDocument();
  });
});