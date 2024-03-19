import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DogsList from './DogsList';

describe('<DogsList />', () => {
  test('it should mount', () => {
    render(<DogsList />);
    
    const dogsList = screen.getByTestId('DogsList');

    expect(dogsList).toBeInTheDocument();
  });
});