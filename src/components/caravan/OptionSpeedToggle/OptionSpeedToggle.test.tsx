import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OptionSpeedToggle from './OptionSpeedToggle';

describe('<OptionSpeedToggle />', () => {
  test('it should mount', () => {
    render(<OptionSpeedToggle />);
    
    const optionSpeedToggle = screen.getByTestId('OptionSpeedToggle');

    expect(optionSpeedToggle).toBeInTheDocument();
  });
});