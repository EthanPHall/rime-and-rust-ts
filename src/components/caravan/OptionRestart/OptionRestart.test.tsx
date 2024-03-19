import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OptionRestart from './OptionRestart';

describe('<OptionRestart />', () => {
  test('it should mount', () => {
    render(<OptionRestart />);
    
    const optionRestart = screen.getByTestId('OptionRestart');

    expect(optionRestart).toBeInTheDocument();
  });
});