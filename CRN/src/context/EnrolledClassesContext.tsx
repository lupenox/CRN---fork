import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'enrolled_classes';
const EnrolledClassesContext = createContext(null);

export function EnrolledClassesProvider({ children }) {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => {
        if (json) setEnrolledClasses(JSON.parse(json));
      })
      .catch(err => console.log('Error loading enrolled classes:', err))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(enrolledClasses))
      .catch(err => console.log('Error saving enrolled classes:', err));
  }, [enrolledClasses, loaded]);

  const addClass = (section) => {
    setEnrolledClasses(prev =>
      prev.find(s => s.crn === section.crn) ? prev : [...prev, section]
    );
  };

  const removeClass = (crn) => {
    setEnrolledClasses(prev => prev.filter(s => s.crn !== crn));
  };

  const isEnrolled = (crn) => enrolledClasses.some(s => s.crn === crn);

  if (!loaded) return null;

  return (
    <EnrolledClassesContext.Provider value={{ enrolledClasses, addClass, removeClass, isEnrolled }}>
      {children}
    </EnrolledClassesContext.Provider>
  );
}

export const useEnrolledClasses = () => useContext(EnrolledClassesContext);