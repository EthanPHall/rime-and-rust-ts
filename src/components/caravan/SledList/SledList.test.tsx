import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SledList from './SledList';

describe('<SledList />', () => {
  test('it should mount', () => {
    render(<SledList />);
    
    const sledList = screen.getByTestId('SledList');

    expect(sledList).toBeInTheDocument();
  });
});