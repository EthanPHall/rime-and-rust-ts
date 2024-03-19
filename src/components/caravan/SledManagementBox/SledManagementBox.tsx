import React, { FC } from 'react';
import './SledManagementBox.css';

interface SledManagementBoxProps {}

const SledManagementBox: FC<SledManagementBoxProps> = () => (
  <div className="SledManagementBox" data-testid="SledManagementBox">
    SledManagementBox Component
  </div>
);

export default SledManagementBox;
