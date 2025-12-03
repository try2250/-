import React from 'react';
import { Student, ClassGroup } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Trophy, Medal, Award } from 'lucide-react';

interface StatisticsProps {
  students: Student[];
  activeClass: ClassGroup | null;
}

const Statistics: React.FC<StatisticsProps> = ({ students, activeClass }) => {
  // Sort students by score descending
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const topStudents = sortedStudents.slice(0, 3);
  
  // Data for chart (Top 10)
  const chartData = sortedStudents.slice(0, 10).map(s => ({
    name: s.name,
    score: s.score
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6'];

  if (!activeClass || students.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-white rounded-xl shadow-sm">
              <Trophy className="w-12 h-12 mb-4 text-gray-300" />
              <p>暂无数据，请先在上课模式中进行提问积分</p>
          </div>
      );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 mb-4">
          <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">{activeClass.name} - 积分统计</h2>
      </div>
      
      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topStudents[1] && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center transform translate-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Medal className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{topStudents[1].name}</div>
                <div className="text-gray-500 font-medium">{topStudents[1].score} 分</div>
                <div className="mt-2 text-sm text-gray-400 uppercase tracking-widest font-bold">Silver</div>
            </div>
        )}

        {topStudents[0] && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-md border border-yellow-200 flex flex-col items-center relative z-10">
                <div className="absolute -top-6">
                    <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-sm" />
                </div>
                <div className="mt-8 text-3xl font-black text-gray-800">{topStudents[0].name}</div>
                <div className="text-yellow-600 font-bold text-xl">{topStudents[0].score} 分</div>
                <div className="mt-2 text-sm text-yellow-500 uppercase tracking-widest font-bold">Champion</div>
            </div>
        )}

        {topStudents[2] && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center transform translate-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-orange-700" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{topStudents[2].name}</div>
                <div className="text-gray-500 font-medium">{topStudents[2].score} 分</div>
                <div className="mt-2 text-sm text-orange-400 uppercase tracking-widest font-bold">Bronze</div>
            </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-96">
        <h3 className="text-lg font-bold text-gray-800 mb-6">积分排行榜 (Top 10)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
            <Tooltip 
                cursor={{fill: '#f9fafb'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;