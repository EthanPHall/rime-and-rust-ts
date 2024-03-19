import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SledTitle from './SledTitle';

describe('<SledTitle />', () => {
  test('it should mount', () => {
    render(<SledTitle />);
    
    const sledTitle = screen.getByTestId('SledTitle');

    expect(sledTitle).toBeInTheDocument();
  });
});