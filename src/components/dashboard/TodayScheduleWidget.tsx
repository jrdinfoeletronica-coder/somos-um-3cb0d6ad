import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function TodayScheduleWidget() {
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Pega a data local de forma segura (YYYY-MM-DD)
        const d = new Date();
        const today = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        const [schedRes, memRes] = await Promise.all([
          supabase
            .from('schedules')
            .select('id, event, schedule_members(member_name, role)')
            .eq('date', today),
          supabase.from('members').select('name, avatar_url')
        ]);

        if (schedRes.error) console.error("Erro schedules:", schedRes.error);
        if (!schedRes.error && schedRes.data) setTodaySchedules(schedRes.data);
        if (!memRes.error && memRes.data) setAllMembers(memRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-4 border rounded-lg animate-pulse bg-secondary/50 h-24 mb-6"></div>;
  
  if (todaySchedules.length === 0) {
    return (
      <div className="bg-secondary/20 border-l-4 border-muted p-4 rounded-r-lg mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-muted-foreground mb-1 flex items-center gap-2">🛋️ Escala de Hoje</h2>
        <p className="text-sm text-muted-foreground">Nenhum evento programado para hoje. Equipe livre!</p>
      </div>
    );
  }

  return (
    <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">🔥 Escala de Hoje</h2>
      {todaySchedules.map((schedule) => (
        <div key={schedule.id} className="mb-3 last:mb-0">
          <h3 className="font-semibold text-sm mb-2 text-foreground">{schedule.event}</h3>
          <div className="flex gap-2 flex-wrap">
            {(schedule.schedule_members || []).map((sm: any, idx: number) => {
              const matchedMember = allMembers.find(m => m.name === sm.member_name);
              return (
                <div key={idx} className="flex items-center bg-background px-3 py-1.5 rounded-full shadow-sm text-xs font-medium border border-border/50">
                  <img 
                    src={matchedMember?.avatar_url || `https://ui-avatars.com/api/?name=${sm.member_name}`} 
                    className="w-5 h-5 rounded-full mr-2 object-cover border border-muted" 
                    alt="" 
                  />
                  {sm.member_name}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
