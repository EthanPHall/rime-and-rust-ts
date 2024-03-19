import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExplanationHoverBox from './ExplanationHoverBox';

describe('<ExplanationHoverBox />', () => {
  test('it should mount', () => {
    render(<ExplanationHoverBox />);
    
    const explanationHoverBox = screen.getByTestId('ExplanationHoverBox');

    expect(explanationHoverBox).toBeInTheDocument();
  });
});