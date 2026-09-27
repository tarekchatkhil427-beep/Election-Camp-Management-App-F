import React from 'react';
import { ShieldAlert, Smartphone, Laptop, History, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const activeSessions = [
  { id: 's-1', device: 'Chrome — Windows', location: 'Dhaka, BD', ip: '192.168.1.1', time: 'Active now', current: true, icon: Laptop },
  { id: 's-2', device: 'Android — Pixel', location: 'Dhaka, BD', ip: '119.30.22.10', time: 'Last seen 2 hours ago', current: false, icon: Smartphone },
  { id: 's-3', device: 'Chrome — Mac', location: 'Chittagong, BD', ip: '103.25.44.2', time: 'Last seen 3 days ago', current: false, icon: Laptop },
];

const securityActivity = [
  { id: 'a-1', event: 'login', desc: 'Successful login from Chrome (Windows)', date: 'Oct 01, 10:42 AM' },
  { id: 'a-2', event: 'password change', desc: 'Password was successfully changed', date: 'Sep 25, 03:15 PM' },
  { id: 'a-3', event: 'session revoked', desc: 'Revoked session for Safari (iOS)', date: 'Sep 20, 11:00 AM' },
  { id: 'a-4', event: 'permission change', desc: 'Jane Director updated your permissions', date: 'Sep 15, 09:30 AM' },
  { id: 'a-5', event: 'logout', desc: 'Logged out from Android (Pixel)', date: 'Sep 10, 08:45 PM' },
];

export default function SecuritySettings() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      
      {/* Authentication */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5" /> Authentication</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage 2FA, session timeouts, and login alerts.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication (2FA)</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="space-y-0.5">
              <Label className="text-base">Login Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a login occurs from a new device.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 rounded border-primary text-primary focus:ring-primary" defaultChecked />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="space-y-0.5">
              <Label className="text-base">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out after inactivity.</p>
            </div>
            <select className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>1 Hour</option>
              <option>Never (Not Recommended)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2"><Smartphone className="h-5 w-5" /> Active Sessions</h2>
            <p className="text-sm text-muted-foreground mt-1">Devices currently logged into your account.</p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2"><LogOut className="h-4 w-4" /> Revoke All Other Sessions</Button>
        </div>
        <div className="divide-y divide-border">
          {activeSessions.map(session => (
            <div key={session.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <session.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{session.device}</h4>
                    {session.current && <Badge variant="success" className="text-[10px] px-1.5 py-0">Current</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{session.location} • {session.ip}</p>
                  <p className="text-xs text-muted-foreground">{session.time}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security Activity Log */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5" /> Security Activity</h2>
          <p className="text-sm text-muted-foreground mt-1">Recent security events related to your account.</p>
        </div>
        <div className="divide-y divide-border">
          {securityActivity.map(act => (
            <div key={act.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center shrink-0 text-muted-foreground">
                  {act.event === 'login' || act.event === 'logout' ? <LogOut className="h-4 w-4" /> :
                   act.event === 'password change' ? <Lock className="h-4 w-4" /> :
                   <ShieldAlert className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm capitalize">{act.event}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{act.desc}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{act.date}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
