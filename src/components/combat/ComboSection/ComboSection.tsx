import React, { FC } from 'react';
import './ComboSection.css';

interface ComboSectionProps {}

const ComboSection: FC<ComboSectionProps> = () => (
  <div className="combo-section" data-testid="combo-section">
    ComboSection Component
  </div>
);

export default ComboSection;
