import React, { FC } from 'react';
import './EventParent.css';
import EventSection from '../EventSection/EventSection';
import InventoryPicker from '../InventoryPicker/InventoryPicker';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';

interface EventParentProps {
  event:RimeEventJSON
}

const EventParent: FC<EventParentProps> = (
  {event}
) => (
  <div className="event-parent" data-testid="event-parent">
      <div className='event-parent-grid-parent'>
        <EventSection event={event}></EventSection>
        <InventoryPicker></InventoryPicker>
      </div>
  </div>
);

export default EventParent;
