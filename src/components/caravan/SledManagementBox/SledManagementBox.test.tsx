import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SledManagementBox from './SledManagementBox';

describe('<SledManagementBox />', () => {
  test('it should mount', () => {
    render(<SledManagementBox />);
    
    const sledManagementBox = screen.getByTestId('SledManagementBox');

    expect(sledManagementBox).toBeInTheDocument();
  });
});