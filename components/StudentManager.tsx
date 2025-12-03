import React, { useState, useRef } from 'react';
import { Student, ClassGroup } from '../types';
import { Plus, Trash2, Upload, FileUp, School, MoreVertical } from 'lucide-react';
import { generateId } from '../services/storageService';

interface StudentManagerProps {
  allStudents: Student[];
  setStudents: (students: Student[]) => void;
  classes: ClassGroup[];
  setClasses: (classes: ClassGroup[]) => void;
  activeClassId: string | null;
  setActiveClassId: (id: string) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ 
    allStudents, 
    setStudents, 
    classes, 
    setClasses,
    activeClassId,
    setActiveClassId
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter students for the current view
  const currentClassStudents = allStudents.filter(s => s.classId === activeClassId);

  // --- Class Management ---
  const handleAddClass = () => {
      if (!newClassName.trim()) return;
      const newClass: ClassGroup = {
          id: generateId(),
          name: newClassName.trim()
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
      setActiveClassId(newClass.id); // Switch to new class
  };

  const handleDeleteClass = (id: string) => {
      if (classes.length <= 1) {
          alert("至少保留一个班级");
          return;
      }
      if (confirm('确定删除该班级吗？该班级的所有学生数据也将被删除！')) {
          // Remove class
          const updatedClasses = classes.filter(c => c.id !== id);
          setClasses(updatedClasses);
          
          // Remove students associated with class
          const updatedStudents = allStudents.filter(s => s.classId !== id);
          setStudents(updatedStudents);

          // Switch active class if we deleted the current one
          if (activeClassId === id) {
              setActiveClassId(updatedClasses[0].id);
          }
      }
  };

  // --- Student Management ---
  const handleAddStudent = () => {
    if (!newStudentName.trim() || !activeClassId) return;
    const newStudent: Student = {
      id: generateId(),
      classId: activeClassId,
      name: newStudentName.trim(),
      score: 0,
      history: []
    };
    setStudents([...allStudents, newStudent]);
    setNewStudentName('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('确定要删除这位学生吗？历史记录将一并删除。')) {
      setStudents(allStudents.filter(s => s.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeClassId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parser
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        
        const newStudents: Student[] = lines.map(name => ({
          id: generateId(),
          classId: activeClassId,
          name: name.replace(/["',]/g, ''), 
          score: 0,
          history: []
        }));

        setStudents([...allStudents, ...newStudents]);
        alert(`成功导入 ${newStudents.length} 名学生到当前班级`);
      } catch (err) {
        alert('文件解析失败，请确保是纯文本或CSV格式');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Class Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <School className="w-5 h-5 mr-2 text-indigo-500" />
              班级管理
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
              {classes.map(cls => (
                  <div 
                    key={cls.id} 
                    onClick={() => setActiveClassId(cls.id)}
                    className={`relative group cursor-pointer px-4 py-2 rounded-lg border flex items-center space-x-2 transition ${activeClassId === cls.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'bg-white border-gray-200 hover:border-indigo-300'}`}
                  >
                      <span>{cls.name}</span>
                      {activeClassId !== cls.id && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                            className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                              <Trash2 className="w-3 h-3" />
                          </button>
                      )}
                  </div>
              ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="新班级名称..."
                className="p-2 border border-gray-300 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddClass}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                  创建新班级
              </button>
          </div>
      </div>

      {/* Student Management Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-blue-500" />
                    添加学生 
                    <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        当前: {classes.find(c => c.id === activeClassId)?.name}
                    </span>
                </div>
            </h3>
            
            <div className="flex gap-4">
            <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                placeholder="输入学生姓名..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
                onClick={handleAddStudent}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
                添加
            </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    支持批量导入 (TXT/CSV, 每行一个名字)
                </div>
                <div className="relative">
                    <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.csv"
                    className="hidden" 
                    />
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                    >
                    <FileUp className="w-4 h-4" />
                    <span>导入到当前班级</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentClassStudents.map(student => (
            <div key={student.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    {student.name.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold text-gray-800">{student.name}</div>
                    <div className="text-xs text-gray-500">当前积分: {student.score}</div>
                </div>
                </div>
                <button
                onClick={() => handleDeleteStudent(student.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                >
                <Trash2 className="w-4 h-4" />
                </button>
            </div>
            ))}
            {currentClassStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                当前班级暂无学生数据，请添加或导入
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentManager;