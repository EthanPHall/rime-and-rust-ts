import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SledDogComponent from './SledDog';

describe('<SledDog />', () => {
  test('it should mount', () => {
    render(<SledDogComponent />);
    
    const sledDog = screen.getByTestId('SledDog');

    expect(sledDog).toBeInTheDocument();
  });
});