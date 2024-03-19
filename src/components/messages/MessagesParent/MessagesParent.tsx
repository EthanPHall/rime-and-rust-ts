import React, { FC } from 'react';
import './MessagesParent.css';

interface MessagesParentProps {}

const MessagesParent: FC<MessagesParentProps> = () => (
  <div className="MessagesParent" data-testid="MessagesParent">
    MessagesParent Component
  </div>
);

export default MessagesParent;
