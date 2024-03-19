import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ComboList from './ComboList';

describe('<ComboList />', () => {
  test('it should mount', () => {
    render(<ComboList />);
    
    const comboList = screen.getByTestId('ComboList');

    expect(comboList).toBeInTheDocument();
  });
});