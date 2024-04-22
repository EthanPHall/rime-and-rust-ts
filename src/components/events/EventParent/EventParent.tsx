import React, { FC } from 'react';
import './EventParent.css';
import EventSection from '../EventSection/EventSection';
import InventoryPicker from '../InventoryPicker/InventoryPicker';

interface EventParentProps {}

const EventParent: FC<EventParentProps> = () => (
  <div className="event-parent" data-testid="event-parent">
      <div className='event-parent-grid-parent'>
        <EventSection></EventSection>
        <InventoryPicker></InventoryPicker>
      </div>
  </div>
);

export default EventParent;
