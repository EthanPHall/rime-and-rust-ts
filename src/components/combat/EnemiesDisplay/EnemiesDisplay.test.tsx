import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EnemiesDisplay from './EnemiesDisplay';

describe('<EnemiesDisplay />', () => {
  test('it should mount', () => {
    render(<EnemiesDisplay />);
    
    const enemiesDisplay = screen.getByTestId('EnemiesDisplay');

    expect(enemiesDisplay).toBeInTheDocument();
  });
});