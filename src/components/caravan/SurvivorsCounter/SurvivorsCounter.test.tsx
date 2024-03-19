import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SurvivorsCounter from './SurvivorsCounter';

describe('<SurvivorsCounter />', () => {
  test('it should mount', () => {
    render(<SurvivorsCounter />);
    
    const survivorsCounter = screen.getByTestId('SurvivorsCounter');

    expect(survivorsCounter).toBeInTheDocument();
  });
});