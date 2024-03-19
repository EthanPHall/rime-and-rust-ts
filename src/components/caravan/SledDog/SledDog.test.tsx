import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SledDog from './SledDog';

describe('<SledDog />', () => {
  test('it should mount', () => {
    render(<SledDog />);
    
    const sledDog = screen.getByTestId('SledDog');

    expect(sledDog).toBeInTheDocument();
  });
});