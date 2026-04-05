'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Attendance() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const attendanceGrids = [
    {
      member: 'Maria Santos',
      month: 'December 2024',
      days: [
        true, true, true, false, true, true, true, false, true, true,
        true, true, false, true, true, true, true, true, false, true,
        true, true, true, true, false, true, true, true, true, false,
        true,
      ],
    },
    {
      member: 'Carlo Reyes',
      month: 'December 2024',
      days: [
        true, true, false, true, true, true, true, true, true, true,
        false, true, true, true, true, true, true, false, true, true,
        true, true, true, false, true, true, true, true, true, true,
        false,
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="ATTENDANCE" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        <div className="p-3 sm:p-4 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">Attendance Tracking</h2>
            <div className="flex items-center gap-2 ml-auto">
              <select className="px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent border border-border rounded-lg text-8px sm:text-xs font-display text-muted hover:text-text transition-colors cursor-pointer">
                <option>December 2024</option>
                <option>November 2024</option>
                <option>October 2024</option>
              </select>
              <Button variant="ghost" size="sm">
                ↓ Export
              </Button>
            </div>
          </div>

          {/* Attendance Cards */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {attendanceGrids.map((grid, idx) => (
              <Card key={idx} title={grid.member} subtitle={grid.month}>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-1 sm:gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="hidden sm:block text-center">
                      <div className="text-8px text-muted font-mono font-semibold mb-1">{day}</div>
                    </div>
                  ))}
                  {/* Mobile header - abbreviated */}
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].slice(0, 5).map((day) => (
                    <div key={day} className="sm:hidden text-center">
                      <div className="text-7px text-muted font-mono font-semibold mb-1">{day}</div>
                    </div>
                  ))}
                  {/* Days grid - show only Mon-Fri on mobile */}
                  {grid.days.map((present, dayIdx) => {
                    // For mobile, only show first 5 days per week (Mon-Fri)
                    const dayOfWeek = dayIdx % 7;
                    if (isMobile && dayOfWeek >= 5) return null;
                    
                    return (
                      <div
                        key={dayIdx}
                        className={`aspect-square rounded-lg flex items-center justify-center font-mono text-8px sm:text-9px font-semibold border transition-all cursor-default ${
                          present
                            ? 'bg-success/15 border-success/30 text-success'
                            : 'bg-accent2/8 border-accent2/15 text-accent2/40'
                        }`}
                      >
                        <span className="text-7px sm:text-8px">{dayIdx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
