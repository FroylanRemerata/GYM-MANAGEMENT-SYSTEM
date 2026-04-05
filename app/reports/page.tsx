'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';

export default function Reports() {
  const reportCards = [
    {
      icon: '📊',
      title: 'Member Analytics',
      desc: 'Detailed insights on member demographics, retention, and engagement',
    },
    {
      icon: '💰',
      title: 'Revenue Report',
      desc: 'Complete breakdown of income sources and payment trends',
    },
    {
      icon: '📈',
      title: 'Growth Metrics',
      desc: 'Track membership growth, churn rate, and expansion analysis',
    },
    {
      icon: '🎯',
      title: 'Performance Dashboard',
      desc: 'KPI tracking and goal progress visualization',
    },
    {
      icon: '📅',
      title: 'Attendance Report',
      desc: 'Member check-in patterns and peak hours analysis',
    },
    {
      icon: '🏆',
      title: 'Top Performers',
      desc: 'Most active members and class attendance leaders',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="REPORTS" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        <div className="p-3 sm:p-4 md:p-8">
          <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text mb-4 sm:mb-6">Generate Reports</h2>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {reportCards.map((report, idx) => (
              <Card key={idx} className="cursor-pointer hover:border-accent/30 hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{report.icon}</div>
                <div className="font-semibold text-sm text-text mb-1">{report.title}</div>
                <div className="text-8px sm:text-xs text-muted">{report.desc}</div>
              </Card>
            ))}
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
