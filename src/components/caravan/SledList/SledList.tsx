import React, { FC } from 'react';
import './SledList.css';

interface SledListProps {}

const SledList: FC<SledListProps> = () => (
  <div className="SledList" data-testid="SledList">
    SledList Component
  </div>
);

export default SledList;
