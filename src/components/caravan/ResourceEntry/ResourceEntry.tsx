import React, { FC } from 'react';
import './ResourceEntry.css';

interface ResourceEntryProps {}

const ResourceEntry: FC<ResourceEntryProps> = () => (
  <div className="ResourceEntry" data-testid="ResourceEntry">
    ResourceEntry Component
  </div>
);

export default ResourceEntry;
