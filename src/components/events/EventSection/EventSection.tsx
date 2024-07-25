import React, { FC } from 'react';
import './EventSection.css';
import LootPicker from '../LootPicker/LootPicker';
import RimeEventJSON from '../../../classes/events/RimeEventJSON';

interface EventSectionProps {
  event:RimeEventJSON
}

const EventSection: FC<EventSectionProps> = (
  {event}
) => (
  <div className="event-section" data-testid="event-section">
    <div className='title'>{event.getName()}</div>
    <div className='content-section'>
      <LootPicker></LootPicker>
    </div>
    <div className='buttons'>
      <button>Option 1</button>
      <button>Option 2</button>
    </div>
  </div>
);

export default EventSection;
