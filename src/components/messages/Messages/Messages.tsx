import React, { FC } from 'react';
import './Messages.css';

interface MessagesProps {}

const Messages: FC<MessagesProps> = () => (
  <div className="Messages" data-testid="Messages">
    Messages Component
  </div>
);

export default Messages;
