import React, { FC } from 'react';
import './SectionLabel.css';

interface SectionLabelProps {
  sectionName: string;
}

const SectionLabel: FC<SectionLabelProps> = (props) => (
  <div className="section-label" data-testid="section-label">
    {props.sectionName}
  </div>
);

export default SectionLabel;
