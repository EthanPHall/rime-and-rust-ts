import React, { FC } from 'react';
import './ComboEntry.css';

interface ComboEntryProps {}

const ComboEntry: FC<ComboEntryProps> = () => (
  <div className="ComboEntry" data-testid="ComboEntry">
    ComboEntry Component
  </div>
);

export default ComboEntry;
