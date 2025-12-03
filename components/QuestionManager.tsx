import React, { useState, useRef } from 'react';
import { Question } from '../types';
import { generateId } from '../services/storageService';
import { Plus, Trash2, FileUp, Download } from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  setQuestions: (q: Question[]) => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ questions, setQuestions }) => {
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [subject, setSubject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!content.trim()) return;
    const newQ: Question = {
      id: generateId(),
      content: content.trim(),
      difficulty,
      subject: subject.trim() || undefined,
      tags: []
    };
    setQuestions([...questions, newQ]);
    setContent('');
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        
        // Supports CSV style: "Question Content, Difficulty, Subject"
        // Or simple text lines
        const newQuestions: Question[] = lines.map(line => {
            const parts = line.split(/[,，]/); // Split by comma (English or Chinese)
            const content = parts[0].trim();
            // Try to parse difficulty if present
            let diff: 'Easy'|'Medium'|'Hard' = 'Medium';
            const diffStr = parts[1]?.trim().toLowerCase();
            if (diffStr === 'easy' || diffStr === '简单') diff = 'Easy';
            else if (diffStr === 'hard' || diffStr === '困难') diff = 'Hard';
            
            const subj = parts[2]?.trim();

            return {
                id: generateId(),
                content: content,
                difficulty: diff,
                subject: subj || undefined,
                tags: []
            };
        });

        setQuestions([...questions, ...newQuestions]);
        alert(`成功导入 ${newQuestions.length} 道题目`);
      } catch (err) {
        alert('导入失败，请检查文件格式');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
      const template = "这是一道简单题,简单,数学\n这是一道中等题,中等,历史\n这是一道困难题,困难,物理\n或者您可以直接每行输入一个问题内容，无需后续字段";
      const blob = new Blob([template], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '题库导入模板.txt';
      a.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Manual Entry */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                手动添加题目
            </h3>
            <div className="flex gap-2">
                 <button 
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 px-3 py-2 text-sm transition"
                >
                    <Download className="w-4 h-4" />
                    <span>下载模板</span>
                </button>
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
                        className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition border border-green-200"
                    >
                        <FileUp className="w-4 h-4" />
                        <span>批量导入题库</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入题目内容..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
          />
          <div className="flex gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="Easy">简单</option>
              <option value="Medium">中等</option>
              <option value="Hard">困难</option>
            </select>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="科目 (选填)"
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAdd}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              保存题目
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-500 grid grid-cols-12 gap-4">
          <div className="col-span-8">题目内容</div>
          <div className="col-span-2 text-center">难度</div>
          <div className="col-span-1 text-center">科目</div>
          <div className="col-span-1 text-center">操作</div>
        </div>
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {questions.map(q => (
            <div key={q.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50">
              <div className="col-span-8 text-gray-800">{q.content}</div>
              <div className="col-span-2 text-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {q.difficulty === 'Easy' ? '简单' : q.difficulty === 'Medium' ? '中等' : '困难'}
                </span>
              </div>
              <div className="col-span-1 text-center text-sm text-gray-500">{q.subject || '-'}</div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="p-8 text-center text-gray-400">暂无题目，请手动添加或导入</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;