import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaravanSectionValuables from './CaravanSectionValuables';

describe('<CaravanSectionValuables />', () => {
  test('it should mount', () => {
    render(<CaravanSectionValuables />);
    
    const caravanSectionValuables = screen.getByTestId('CaravanSectionValuables');

    expect(caravanSectionValuables).toBeInTheDocument();
  });
});