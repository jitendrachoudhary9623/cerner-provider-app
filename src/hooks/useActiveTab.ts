// hooks/useActiveTab.ts
import { useState } from 'react';

export const useActiveTab = (initialTab = 'summary') => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return { activeTab, setActiveTab };
};
