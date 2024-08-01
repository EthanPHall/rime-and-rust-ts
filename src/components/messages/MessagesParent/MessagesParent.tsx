import React, { FC } from 'react';
import './MessagesParent.css';
import Gradient from '../Gradient/Gradient';
import Messages from '../Messages/Messages';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import { MessageHandlingContext } from '../../../App';

interface MessagesParentProps {}

const MessagesParent: FC<MessagesParentProps> = () => {

  const messageHandlingContext = React.useContext(MessageHandlingContext);

  return (<div className="messages-parent" data-testid="messages-parent">
      <SectionLabel sectionName='Messages'></SectionLabel>
      <Gradient></Gradient>
      <Messages messages={messageHandlingContext.messageHandling.getManager().getMessages()}></Messages>
    </div>
  );
}

export default MessagesParent;
