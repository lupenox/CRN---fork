import React, { createContext, useContext, useState } from 'react';

const EnrolledClassesContext = createContext(null);

export function EnrolledClassesProvider({ children }) {
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  const addClass = (section) => {
    setEnrolledClasses(prev =>
      prev.find(s => s.crn === section.crn) ? prev : [...prev, section]
    );
  };

  const removeClass = (crn) => {
    setEnrolledClasses(prev => prev.filter(s => s.crn !== crn));
  };

  const isEnrolled = (crn) => enrolledClasses.some(s => s.crn === crn);

  return (
    <EnrolledClassesContext.Provider value={{ enrolledClasses, addClass, removeClass, isEnrolled }}>
      {children}
    </EnrolledClassesContext.Provider>
  );
}

export const useEnrolledClasses = () => useContext(EnrolledClassesContext);