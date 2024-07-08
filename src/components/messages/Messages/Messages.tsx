import React, { FC } from 'react';
import './Messages.css';
import { Message } from '../../../classes/caravan/Message';

interface MessagesProps {
  messages:Message[];
}

const Messages: FC<MessagesProps> = ({messages}) => {
  return (
    <div className="messages" data-testid="messages">
      {messages.map((message, index) => {
        return <div className={`${message.messageClasses.map((messageClass) => {
          return messageClass + ' ';
        })}`}>{message.message}</div>
      })}
    </div>
  );
}

export default Messages;