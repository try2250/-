import React from 'react';
import { ViewState, AppState, ClassGroup } from '../types';
import { Users, BookOpen, PlayCircle, ArrowRight, School } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  setView: (view: ViewState) => void;
  activeClass: ClassGroup | null;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setView, activeClass }) => {
  const activeStudentCount = state.students.filter(s => s.classId === activeClass?.id).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">欢迎回来, 老师</h1>
        <p className="text-gray-500 text-lg">
            当前正在管理: <span className="font-bold text-blue-600">{activeClass?.name || "请选择班级"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div 
          onClick={() => setView(ViewState.SESSION)}
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
             <PlayCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">快速开始</h3>
            <p className="text-blue-100 mb-8">进入随机抽查与积分模式</p>
            <div className="flex items-center text-sm font-semibold">
              立即进入 <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div 
           onClick={() => setView(ViewState.STUDENTS)}
           className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
             <School className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">班级与学生</h3>
          <p className="text-gray-500 mb-4">管理 {activeClass?.name || '班级'} 名单与积分</p>
          <div className="text-3xl font-black text-gray-900">
             {activeStudentCount} <span className="text-base font-medium text-gray-400">人</span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
           onClick={() => setView(ViewState.QUESTIONS)}
           className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
             <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">题库管理</h3>
          <p className="text-gray-500 mb-4">全校共享题库</p>
          <div className="text-3xl font-black text-gray-900">
             {state.questions.length} <span className="text-base font-medium text-gray-400">题</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;