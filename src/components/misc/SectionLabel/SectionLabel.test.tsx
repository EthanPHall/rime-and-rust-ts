import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SectionLabel from './SectionLabel';

describe('<SectionLabel />', () => {
  test('it should mount', () => {
    render(<SectionLabel sectionName='test'/>);
    
    const sectionLabel = screen.getByTestId('SectionLabel');

    expect(sectionLabel).toBeInTheDocument();
  });
});