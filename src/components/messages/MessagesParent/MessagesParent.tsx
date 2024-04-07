import React, { FC } from 'react';
import './MessagesParent.css';
import Gradient from '../Gradient/Gradient';
import Messages from '../Messages/Messages';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';

interface MessagesParentProps {}

const MessagesParent: FC<MessagesParentProps> = () => (
  <div className="messages-parent" data-testid="messages-parent">
    <SectionLabel sectionName='Messages'></SectionLabel>
    <Gradient></Gradient>
    <Messages></Messages>
  </div>
);

export default MessagesParent;
