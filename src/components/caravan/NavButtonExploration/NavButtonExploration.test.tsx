import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavButtonExploration from './NavButtonExploration';

describe('<NavButtonExploration />', () => {
  test('it should mount', () => {
    render(<NavButtonExploration />);
    
    const navButtonExploration = screen.getByTestId('NavButtonExploration');

    expect(navButtonExploration).toBeInTheDocument();
  });
});