import React, { useState, useCallback } from 'react';
import { Student, Question, ClassGroup } from '../types';
import { Shuffle, Check, X, HelpCircle, Trophy } from 'lucide-react';
import { playTick, playFanfare, playSuccess, playFailure } from '../services/audioService';

interface SessionModeProps {
  students: Student[];
  questions: Question[];
  onUpdateStudent: (s: Student) => void;
  activeClass: ClassGroup | null;
}

const SessionMode: React.FC<SessionModeProps> = ({ students, questions, onUpdateStudent, activeClass }) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showAnswerControls, setShowAnswerControls] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'failure', points: number} | null>(null);

  // Random Picker Logic
  const pickRandomStudent = useCallback(() => {
    if (students.length === 0) return;
    
    setIsRolling(true);
    setShowAnswerControls(false);
    setFeedback(null);
    setCurrentQuestion(null);

    let counter = 0;
    // Speed up logic could be added, but linear is fine for now
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setCurrentStudent(students[randomIndex]);
      playTick(); // Audio effect
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setIsRolling(false);
        playFanfare(); // Audio effect
        
        // Also pick a question if available
        if (questions.length > 0) {
            const randomQ = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(randomQ);
        }
        setShowAnswerControls(true);
      }
    }, 80);
  }, [students, questions]);

  const handleScore = (points: number) => {
    if (!currentStudent) return;
    
    if (points > 0) playSuccess();
    else if (points < 0) playFailure();

    const updatedStudent = {
      ...currentStudent,
      score: currentStudent.score + points,
      history: [
        ...currentStudent.history,
        {
          questionId: currentQuestion?.id,
          points,
          timestamp: Date.now()
        }
      ]
    };
    
    onUpdateStudent(updatedStudent);
    setCurrentStudent(updatedStudent); 
    setShowAnswerControls(false);
    setFeedback({
        type: points > 0 ? 'success' : 'failure',
        points
    });
  };

  if (!activeClass) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <HelpCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-xl">请先选择或创建一个班级</p>
          </div>
      );
  }

  if (students.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <HelpCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-xl">当前班级 ({activeClass.name}) 暂无学生</p>
              <p className="text-sm mt-2">请在“班级与学生”页面添加学生</p>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
      
      {/* Student Display Card */}
      <div className={`
        relative w-full max-w-lg aspect-video bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 transition-all transform duration-300 border-4
        ${isRolling ? 'scale-95 border-blue-200' : 'scale-100 border-blue-500'}
        ${feedback?.type === 'failure' ? 'animate-shake border-red-400' : ''}
        ${feedback?.type === 'success' ? 'border-green-400' : ''}
      `}>
         {!currentStudent ? (
             <div className="text-gray-400 flex flex-col items-center">
                 <Trophy className="w-16 h-16 mb-4 opacity-50" />
                 <span className="text-2xl font-light">准备开始提问</span>
                 <span className="text-sm mt-2 font-medium bg-gray-100 px-3 py-1 rounded-full">{activeClass.name}</span>
             </div>
         ) : (
             <>
                <div className="text-8xl font-black text-gray-800 tracking-tight mb-4 text-center">
                    {currentStudent.name}
                </div>
                <div className="text-2xl text-blue-600 font-medium bg-blue-50 px-6 py-2 rounded-full">
                    当前积分: {currentStudent.score}
                </div>
             </>
         )}

         {/* Feedback Overlay */}
         {feedback && (
             <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-col z-20 animate-pop">
                 <div className={`text-6xl font-bold mb-4 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                     {feedback.points > 0 ? `+${feedback.points}` : feedback.points}
                 </div>
                 <div className="text-gray-600 text-xl font-medium flex items-center">
                     {feedback.type === 'success' ? (
                         <><Check className="w-6 h-6 mr-2" /> 回答正确！</>
                     ) : (
                         <><X className="w-6 h-6 mr-2" /> 继续加油！</>
                     )}
                 </div>
                 {feedback.type === 'success' && (
                     <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                         {/* Simple CSS Confetti Dots */}
                         <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-400 rounded-full animate-bounce delay-75"></div>
                         <div className="absolute top-1/3 left-2/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                         <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-150"></div>
                         <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></div>
                         <div className="absolute top-1/4 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300"></div>
                     </div>
                 )}
             </div>
         )}
      </div>

      {/* Question Card */}
      {currentQuestion && !isRolling && !feedback && (
          <div className="w-full max-w-2xl bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-in slide-in-from-bottom-4 duration-500 shadow-md">
              <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      currentQuestion.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                      currentQuestion.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                  }`}>
                      {currentQuestion.difficulty === 'Easy' ? '简单' : currentQuestion.difficulty === 'Medium' ? '中等' : '困难'}
                  </span>
                  <span className="text-xs text-indigo-400 font-semibold uppercase">题目</span>
              </div>
              <p className="text-xl text-indigo-900 font-medium leading-relaxed">
                  {currentQuestion.content}
              </p>
          </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-6">
        {!showAnswerControls ? (
            <button
                onClick={pickRandomStudent}
                disabled={isRolling}
                className={`
                    flex items-center space-x-3 px-10 py-5 rounded-2xl text-2xl font-bold shadow-lg transition-all transform hover:-translate-y-1 active:scale-95
                    ${isRolling ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30'}
                `}
            >
                <Shuffle className={`w-8 h-8 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{isRolling ? '抽取中...' : '随机抽查'}</span>
            </button>
        ) : (
            <>
                <button
                    onClick={() => handleScore(0)}
                    className="p-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    title="跳过/不计分"
                >
                    <span className="font-bold text-lg">跳过</span>
                </button>
                <button
                    onClick={() => handleScore(-1)}
                    className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition hover:scale-105 active:scale-95"
                >
                    <X className="w-8 h-8 mb-1" />
                    <span className="font-bold text-lg">-1</span>
                </button>
                <button
                    onClick={() => handleScore(1)}
                    className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-green-50 text-green-600 border-2 border-green-100 hover:bg-green-100 hover:border-green-200 transition hover:scale-105 active:scale-95"
                >
                    <Check className="w-8 h-8 mb-1" />
                    <span className="font-bold text-lg">+1</span>
                </button>
                <button
                    onClick={() => handleScore(2)}
                    className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition hover:scale-105 active:scale-95"
                >
                    <div className="flex">
                        <Check className="w-5 h-5" />
                        <Check className="w-5 h-5 -ml-2" />
                    </div>
                    <span className="font-bold text-lg">+2</span>
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default SessionMode;