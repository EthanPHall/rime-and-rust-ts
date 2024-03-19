import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OptionShare from './OptionShare';

describe('<OptionShare />', () => {
  test('it should mount', () => {
    render(<OptionShare />);
    
    const optionShare = screen.getByTestId('OptionShare');

    expect(optionShare).toBeInTheDocument();
  });
});