import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpgradeEntry from './UpgradeEntry';

describe('<UpgradeEntry />', () => {
  test('it should mount', () => {
    render(<UpgradeEntry />);
    
    const upgradeEntry = screen.getByTestId('UpgradeEntry');

    expect(upgradeEntry).toBeInTheDocument();
  });
});