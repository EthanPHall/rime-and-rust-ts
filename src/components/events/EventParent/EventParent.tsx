import React, { FC } from 'react';
import './EventParent.css';

interface EventParentProps {}

const EventParent: FC<EventParentProps> = () => (
  <div className="event-parent" data-testid="event-parent">
      <div className='event-parent-grid-parent'>
        <div className='event-parent-event-section'>
          Event Section
          <div className='event-parent-loot-picker'>Loot Picker</div>
        </div>
          <div className='event-parent-inventory-picker'>Inventory Picker</div>
      </div>
  </div>
);

export default EventParent;
