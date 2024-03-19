import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaravanSectionSleds from './CaravanSectionSleds';

describe('<CaravanSectionSleds />', () => {
  test('it should mount', () => {
    render(<CaravanSectionSleds />);
    
    const caravanSectionSleds = screen.getByTestId('CaravanSectionSleds');

    expect(caravanSectionSleds).toBeInTheDocument();
  });
});