import React from 'react';
import { getStatusBadgeClass, getOutcomeBadgeClass } from '../../constants/statusColors';

const BASE = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';

const Badge = ({ tone, value, className = '', children }) => {
  let toneClass = '';
  if (className) {
    toneClass = '';
  } else if (tone === 'status') {
    toneClass = getStatusBadgeClass(value);
  } else if (tone === 'outcome') {
    toneClass = getOutcomeBadgeClass(value);
  }
  return <span className={`${BASE} ${toneClass} ${className}`}>{children}</span>;
};

export default Badge;
