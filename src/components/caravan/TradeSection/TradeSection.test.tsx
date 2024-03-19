import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TradeSection from './TradeSection';

describe('<TradeSection />', () => {
  test('it should mount', () => {
    render(<TradeSection />);
    
    const tradeSection = screen.getByTestId('TradeSection');

    expect(tradeSection).toBeInTheDocument();
  });
});