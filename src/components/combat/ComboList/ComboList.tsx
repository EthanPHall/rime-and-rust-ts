import React, { FC } from 'react';
import './ComboList.css';

interface ComboListProps {}

const ComboList: FC<ComboListProps> = () => (
  <div className="ComboList" data-testid="ComboList">
    ComboList Component
  </div>
);

export default ComboList;
