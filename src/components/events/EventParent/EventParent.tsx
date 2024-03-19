import React, { FC } from 'react';
import './EventParent.css';

interface EventParentProps {}

const EventParent: FC<EventParentProps> = () => (
  <div className="EventParent" data-testid="EventParent">
    EventParent Component
  </div>
);

export default EventParent;
