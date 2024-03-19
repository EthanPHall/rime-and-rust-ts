import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExplorationResourcesPicker from './ExplorationResourcesPicker';

describe('<ExplorationResourcesPicker />', () => {
  test('it should mount', () => {
    render(<ExplorationResourcesPicker />);
    
    const explorationResourcesPicker = screen.getByTestId('ExplorationResourcesPicker');

    expect(explorationResourcesPicker).toBeInTheDocument();
  });
});