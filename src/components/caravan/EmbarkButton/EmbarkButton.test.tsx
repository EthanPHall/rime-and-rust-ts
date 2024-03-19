import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmbarkButton from './EmbarkButton';

describe('<EmbarkButton />', () => {
  test('it should mount', () => {
    render(<EmbarkButton />);
    
    const embarkButton = screen.getByTestId('EmbarkButton');

    expect(embarkButton).toBeInTheDocument();
  });
});