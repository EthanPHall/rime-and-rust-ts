import React, { FC } from 'react';
import './EventSection.css';

interface EventSectionProps {}

const EventSection: FC<EventSectionProps> = () => (
  <div className="EventSection" data-testid="EventSection">
    EventSection Component
  </div>
);

export default EventSection;
