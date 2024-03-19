import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaravanSectionNavBar from './CaravanSectionNavBar';

describe('<CaravanSectionNavBar />', () => {
  test('it should mount', () => {
    render(<CaravanSectionNavBar />);
    
    const caravanSectionNavBar = screen.getByTestId('CaravanSectionNavBar');

    expect(caravanSectionNavBar).toBeInTheDocument();
  });
});