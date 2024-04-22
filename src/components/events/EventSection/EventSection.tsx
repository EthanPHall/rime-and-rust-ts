import React, { FC } from 'react';
import './EventSection.css';
import LootPicker from '../LootPicker/LootPicker';

interface EventSectionProps {}

const EventSection: FC<EventSectionProps> = () => (
  <div className="event-section" data-testid="event-section">
    <div className='title'>Event Title</div>
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
