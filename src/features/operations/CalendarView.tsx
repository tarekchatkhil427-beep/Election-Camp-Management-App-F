import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockEvents = [
  { date: new Date(2026, 9, 15), title: 'Community Townhall', type: 'event' },
  { date: new Date(2026, 9, 10), title: 'Volunteer Training', type: 'event' },
  { date: new Date(2026, 9, 10), title: 'Task: Distribute Flyers', type: 'task' },
  { date: new Date(2026, 9, 18), title: 'Street Rally', type: 'event' },
];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // Oct 2026

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-sm py-2 text-muted-foreground" key={i}>
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-border">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = startOfWeek(monthStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const dayEvents = mockEvents.filter(e => isSameDay(e.date, cloneDay));

        days.push(
          <div
            className={`min-h-[100px] p-2 border-r border-b border-border transition-colors hover:bg-muted/30 cursor-pointer ${
              !isSameMonth(day, monthStart) ? 'bg-muted/10 text-muted-foreground opacity-50' : ''
            } ${isSameDay(day, new Date()) ? 'bg-primary/5 font-bold' : ''}`}
            key={day.toString()}
          >
            <span className="text-sm">{formattedDate}</span>
            <div className="mt-1 space-y-1">
              {dayEvents.map((evt, idx) => (
                <div key={idx} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${evt.type === 'event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {evt.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-card border-l border-t border-border rounded-bl-xl rounded-br-xl overflow-hidden">{rows}</div>;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-4">
      {renderHeader()}
      <div className="border border-border rounded-xl overflow-hidden">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
