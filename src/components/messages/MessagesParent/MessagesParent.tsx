import React, { FC } from 'react';
import './MessagesParent.css';
import Gradient from '../Gradient/Gradient';
import Messages, { Message } from '../Messages/Messages';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface MessagesParentProps {}

const MessagesParent: FC<MessagesParentProps> = () => {

  const [messages, setMessages] = React.useState<Message[]>([
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Tanya Dialogue. Lorem Ipsum Whatever.', true),
    new Message('Tanya Dialogue. Lorem Ipsum Whatever.', true),
    new Message('Tanya Dialogue. Lorem Ipsum Whatever.', true),
    new Message('Tanya Dialogue. Lorem Ipsum Whatever.', true),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
    new Message('Message. Lorem Ipsum Whatever.', false),
  ]);

  return (<div className="messages-parent" data-testid="messages-parent">
      <SectionLabel sectionName='Messages'></SectionLabel>
      <Gradient></Gradient>
      <Messages messages={messages}></Messages>
    </div>
  );
}

export default MessagesParent;
