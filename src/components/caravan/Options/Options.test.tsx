import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Options from './Options';

describe('<Options />', () => {
  test('it should mount', () => {
    render(<Options />);
    
    const options = screen.getByTestId('Options');

    expect(options).toBeInTheDocument();
  });
});