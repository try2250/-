import React, { useState, useEffect } from 'react';
import { AppState, ViewState, Student, Question, ClassGroup } from './types';
import { loadState, saveState, exportData, generateId } from './services/storageService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import QuestionManager from './components/QuestionManager';
import SessionMode from './components/SessionMode';
import Statistics from './components/Statistics';

const App: React.FC = () => {
  // Initialize state from local storage or defaults
  const [state, setState] = useState<AppState>(loadState());
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isLoaded, setIsLoaded] = useState(false);

  // Data Migration & Initialization Logic
  useEffect(() => {
    // Check if we have legacy students (no classId) or no classes at all
    let newState = { ...state };
    let hasChanges = false;

    // If no classes exist but we have students (or just starting fresh), create a default class
    if (newState.classes.length === 0) {
      const defaultClassId = generateId();
      const defaultClass: ClassGroup = { id: defaultClassId, name: '默认班级' };
      newState.classes = [defaultClass];
      newState.activeClassId = defaultClassId;
      
      // Migrate existing students to default class
      if (newState.students.length > 0) {
        newState.students = newState.students.map(s => ({
            ...s,
            classId: s.classId || defaultClassId
        }));
      }
      hasChanges = true;
    } else if (!newState.activeClassId && newState.classes.length > 0) {
        // Ensure an active class is selected
        newState.activeClassId = newState.classes[0].id;
        hasChanges = true;
    }

    if (hasChanges) {
        setState(newState);
    }
    setIsLoaded(true);
  }, []);

  // Save on every change
  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  const updateStudents = (students: Student[]) => {
    setState(prev => ({ ...prev, students }));
  };

  const updateQuestions = (questions: Question[]) => {
    setState(prev => ({ ...prev, questions }));
  };

  const updateClasses = (classes: ClassGroup[]) => {
      setState(prev => ({ ...prev, classes }));
  };

  const setActiveClass = (id: string) => {
      setState(prev => ({ ...prev, activeClassId: id }));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    }));
  };

  const handleExport = () => {
    exportData(state);
  };

  const activeClass = state.classes.find(c => c.id === state.activeClassId) || null;
  const activeStudents = state.students.filter(s => s.classId === state.activeClassId);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
            <Dashboard 
                state={state} 
                setView={setCurrentView} 
                activeClass={activeClass}
            />
        );
      case ViewState.STUDENTS:
        return (
            <StudentManager 
                allStudents={state.students}
                setStudents={updateStudents}
                classes={state.classes}
                setClasses={updateClasses}
                activeClassId={state.activeClassId}
                setActiveClassId={setActiveClass}
            />
        );
      case ViewState.QUESTIONS:
        return <QuestionManager questions={state.questions} setQuestions={updateQuestions} />;
      case ViewState.SESSION:
        return (
          <SessionMode 
            students={activeStudents} // Only pass filtered students
            questions={state.questions}
            onUpdateStudent={handleUpdateStudent}
            activeClass={activeClass}
          />
        );
      case ViewState.STATS:
        return <Statistics students={activeStudents} activeClass={activeClass} />;
      default:
        return <Dashboard state={state} setView={setCurrentView} activeClass={activeClass} />;
    }
  };

  if (!isLoaded) return null;

  return (
    <Layout 
        currentView={currentView} 
        setView={setCurrentView}
        onExport={handleExport}
        classes={state.classes}
        activeClassId={state.activeClassId}
        setActiveClassId={setActiveClass}
    >
      {renderView()}
    </Layout>
  );
};

export default App;