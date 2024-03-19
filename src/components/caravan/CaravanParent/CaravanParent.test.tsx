import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaravanParent from './CaravanParent';

describe('<CaravanParent />', () => {
  test('it should mount', () => {
    render(<CaravanParent />);
    
    const caravanParent = screen.getByTestId('CaravanParent');

    expect(caravanParent).toBeInTheDocument();
  });
});