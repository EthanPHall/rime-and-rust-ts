import React, { FC } from 'react';
import './PrepWindowActionEntry.css';

interface PrepWindowActionEntryProps {}

const PrepWindowActionEntry: FC<PrepWindowActionEntryProps> = () => (
  <div className="prep-window-action-entry">
    <div className='action-name'>
      Attack x2
    </div>
    <button className='action-toggle'>
      [ ]
    </button>
  </div>
);

export default PrepWindowActionEntry;
