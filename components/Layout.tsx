import React, { ReactNode } from 'react';
import { ViewState, ClassGroup } from '../types';
import { 
  Users, 
  BookOpen, 
  PlayCircle, 
  BarChart2, 
  Home, 
  Download,
  ChevronDown,
  School
} from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: ReactNode;
  onExport: () => void;
  classes: ClassGroup[];
  activeClassId: string | null;
  setActiveClassId: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
    currentView, 
    setView, 
    children, 
    onExport,
    classes,
    activeClassId,
    setActiveClassId
}) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: '首页', icon: Home },
    { view: ViewState.SESSION, label: '开始上课', icon: PlayCircle },
    { view: ViewState.STUDENTS, label: '班级与学生', icon: Users }, // Renamed
    { view: ViewState.QUESTIONS, label: '公共题库', icon: BookOpen },
    { view: ViewState.STATS, label: '统计排行', icon: BarChart2 },
  ];

  const activeClassName = classes.find(c => c.id === activeClassId)?.name || '选择班级';

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800">课堂伴侣</span>
        </div>

        {/* Class Selector */}
        <div className="px-4 py-4">
            <div className="relative group">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 p-3 rounded-xl flex items-center justify-between transition-colors">
                    <div className="flex items-center truncate">
                        <School className="w-4 h-4 mr-2" />
                        <span className="font-semibold text-sm truncate max-w-[120px]">{activeClassName}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </button>
                {/* Dropdown Content */}
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-20">
                    {classes.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveClassId(c.id)}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between ${activeClassId === c.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}
                        >
                            <span className="truncate">{c.name}</span>
                            {activeClassId === c.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                        </button>
                    ))}
                    <button 
                        onClick={() => setView(ViewState.STUDENTS)}
                        className="w-full text-left px-4 py-2 bg-gray-50 text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-100 border-t border-gray-100"
                    >
                        + 管理班级
                    </button>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={onExport}
             className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
           >
             <Download className="w-4 h-4" />
             <span>备份所有数据</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-4">
             <h2 className="text-lg font-semibold text-gray-800">
                {navItems.find(n => n.view === currentView)?.label}
             </h2>
             {activeClassId && (
                 <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                     当前: {activeClassName}
                 </span>
             )}
          </div>
          <div className="text-sm text-gray-500">
             Portable Classroom Assistant v2.0
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;