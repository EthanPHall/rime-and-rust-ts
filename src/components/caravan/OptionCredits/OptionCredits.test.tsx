import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OptionCredits from './OptionCredits';

describe('<OptionCredits />', () => {
  test('it should mount', () => {
    render(<OptionCredits />);
    
    const optionCredits = screen.getByTestId('OptionCredits');

    expect(optionCredits).toBeInTheDocument();
  });
});