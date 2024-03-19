import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaravanSectionCrafting from './CaravanSectionCrafting';

describe('<CaravanSectionCrafting />', () => {
  test('it should mount', () => {
    render(<CaravanSectionCrafting />);
    
    const caravanSectionCrafting = screen.getByTestId('CaravanSectionCrafting');

    expect(caravanSectionCrafting).toBeInTheDocument();
  });
});