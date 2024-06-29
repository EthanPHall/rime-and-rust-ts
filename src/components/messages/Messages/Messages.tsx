import React, { FC } from 'react';
import './Messages.css';

class Message {
  message: string;
  isTanya: boolean;

  constructor(message: string, isTanya: boolean) {
    this.message = message;
    this.isTanya = isTanya;
  }
}

interface MessagesProps {
  messages:Message[];
}

const Messages: FC<MessagesProps> = ({messages}) => {
  

  return (
    <div className="messages" data-testid="messages">
      {messages.map((message, index) => {
        return <div className={`${message.isTanya && "tanya-dialogue"}`}>{message.message}</div>
      })}
    </div>
  );
}

export default Messages;
export { Message };