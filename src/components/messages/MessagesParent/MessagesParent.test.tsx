import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MessagesParent from './MessagesParent';

describe('<MessagesParent />', () => {
  test('it should mount', () => {
    render(<MessagesParent />);
    
    const messagesParent = screen.getByTestId('MessagesParent');

    expect(messagesParent).toBeInTheDocument();
  });
});