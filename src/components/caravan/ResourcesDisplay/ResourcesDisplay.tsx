import React, { FC } from 'react';
import './ResourcesDisplay.css';

interface ResourcesDisplayProps {}

const ResourcesDisplay: FC<ResourcesDisplayProps> = () => (
  <div className="ResourcesDisplay" data-testid="ResourcesDisplay">
    ResourcesDisplay Component
  </div>
);

export default ResourcesDisplay;
