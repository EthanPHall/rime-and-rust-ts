import React, { FC } from 'react';
import './ExplorationResourcesPicker.css';
import SectionLabel from '../../misc/SectionLabel/SectionLabel';
import ExplorationResourcesEntry from '../ExplorationResourcesEntry/ExplorationResourcesEntry';

interface ExplorationResourcesPickerProps {}

const ExplorationResourcesPicker: FC<ExplorationResourcesPickerProps> = () => (
  <div className="exploration-resources-picker" data-testid="exploration-resources-picker">
    <SectionLabel sectionName='Equipment'></SectionLabel>
    <div className='spacing'></div>
    <ExplorationResourcesEntry></ExplorationResourcesEntry>
    <ExplorationResourcesEntry></ExplorationResourcesEntry>
    <ExplorationResourcesEntry></ExplorationResourcesEntry>
    <ExplorationResourcesEntry></ExplorationResourcesEntry>
  </div>
);

export default ExplorationResourcesPicker;
