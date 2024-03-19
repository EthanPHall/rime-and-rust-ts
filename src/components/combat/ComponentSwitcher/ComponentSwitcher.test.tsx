import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ComponentSwitcher from './ComponentSwitcher';

describe('<ComponentSwitcher />', () => {
  test('it should mount', () => {
    render(<ComponentSwitcher />);
    
    const componentSwitcher = screen.getByTestId('ComponentSwitcher');

    expect(componentSwitcher).toBeInTheDocument();
  });
});