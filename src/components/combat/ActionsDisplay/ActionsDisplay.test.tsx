import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionsDisplay from './ActionsDisplay';

describe('<ActionsDisplay />', () => {
  test('it should mount', () => {
    render(<ActionsDisplay />);
    
    const actionsDisplay = screen.getByTestId('ActionsDisplay');

    expect(actionsDisplay).toBeInTheDocument();
  });
});