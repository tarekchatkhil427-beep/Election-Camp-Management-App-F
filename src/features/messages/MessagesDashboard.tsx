import React, { useState, useEffect } from 'react';
import { Search, Paperclip, Send, Check, CheckCheck, MoreVertical, Users, Megaphone, User, ArrowLeft, Image as ImageIcon, Smile, FileText, MessageSquare, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCampaignStore } from '@/store/campaignStore';
import { useAuth } from '@/auth/MockAuthProvider';

// Mock Data
type TabType = 'dms' | 'directory' | 'groups' | 'announcements';

const mockDMs = [
  { id: 'dm-1', name: 'Rahim Ahmed', role: 'Ward Coordinator', lastMessage: 'Can you send the voter list?', time: '10:42 AM', unread: 2, online: true },
  { id: 'dm-2', name: 'Jane Director', role: 'Campaign Director', lastMessage: 'Approved the budget.', time: 'Yesterday', unread: 0, online: false },
  { id: 'dm-3', name: 'Alif Hossain', role: 'Volunteer', lastMessage: 'I have finished distributing the flyers.', time: 'Yesterday', unread: 0, online: true },
];

const initialGroups = [
  { id: 'g-1', name: 'Campaign HQ', role: 'Global', lastMessage: 'Jane: Meeting at 5 PM today.', time: '9:15 AM', unread: 5 },
  { id: 'g-2', name: 'Ward 01 Team', role: 'Ward 01', lastMessage: 'Rahim: We need more banners.', time: 'Yesterday', unread: 0 },
  { id: 'g-3', name: 'House Coordinators', role: 'Operations', lastMessage: 'System: Weekly report generated.', time: 'Mon', unread: 0 },
];

const mockAnnouncements = [
  { 
    id: 'a-1', title: 'URGENT: Schedule Change for Rally', audience: 'All Staff', priority: 'High', 
    message: 'The rally on Saturday has been moved to 2 PM due to weather conditions. Please inform all volunteers immediately.', 
    time: '2 hours ago', unread: true, metrics: { delivered: 120, read: 105, ack: 89 }, reqAck: true
  },
  { 
    id: 'a-2', title: 'New Campaign Materials Available', audience: 'Ward Coordinators', priority: 'Normal', 
    message: 'Posters and leaflets for Phase 2 are ready for pickup at HQ.', 
    time: 'Yesterday', unread: false, metrics: { delivered: 15, read: 15, ack: 15 }, reqAck: false
  },
];

const mockChatHistory = [
  { id: 'm-1', senderId: 'me', text: 'Hi Rahim, did you get the updated lists?', time: '10:30 AM', status: 'read' },
  { id: 'm-2', senderId: 'dm-1', text: 'Yes, just printing them now.', time: '10:35 AM', status: '' },
  { id: 'm-3', senderId: 'dm-1', text: 'Wait, missing House 12.', time: '10:40 AM', status: '' },
  { id: 'm-4', senderId: 'dm-1', text: 'Can you send the voter list?', time: '10:42 AM', status: '' },
];

export default function MessagesDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('directory');
  const [groups, setGroups] = useState(initialGroups);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { users } = useCampaignStore();
  const { user } = useAuth();
  
  const isAdmin = ['SUPER_ADMIN', 'CANDIDATE', 'CAMPAIGN_DIRECTOR'].includes(user?.role || '');

  // Mock typing indicator randomly
  useEffect(() => {
    if (activeChatId === 'dm-1' && activeTab === 'dms') {
      const interval = setInterval(() => setIsTyping(prev => !prev), 5000);
      return () => clearInterval(interval);
    }
    setIsTyping(false);
  }, [activeChatId, activeTab]);

  const getActiveChatDetails = () => {
    if (activeTab === 'dms' || activeTab === 'directory') {
      if (activeChatId?.startsWith('dir-')) {
        const [, id, name, role] = activeChatId.split('|');
        if (name) {
          return { id: activeChatId, name, role: role || 'User', online: true };
        }
        const userId = activeChatId.replace('dir-', '');
        const user = users.find(u => u.id === userId);
        return { id: activeChatId, name: user?.name || 'Unknown', role: user?.role || 'User', online: true };
      }
      return mockDMs.find(c => c.id === activeChatId);
    }
    if (activeTab === 'groups') return groups.find(c => c.id === activeChatId);
    if (activeTab === 'announcements') return mockAnnouncements.find(c => c.id === activeChatId);
    return null;
  };

  const activeChat = getActiveChatDetails();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setInputText('');
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-8 flex flex-col h-[calc(100vh-100px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Messages & Comms</h1>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex">
        
        {/* LEFT PANEL: Conversation List */}
        <div className={cn(
          "flex flex-col border-r border-border transition-all duration-300",
          activeChatId ? "hidden md:flex w-full md:w-80 lg:w-96" : "flex w-full md:w-80 lg:w-96"
        )}>
          <div className="p-4 border-b border-border">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-muted/50 border-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as TabType); setActiveChatId(null); }} className="w-full">
              <TabsList className="w-full grid grid-cols-4 p-1 bg-muted/50 h-auto">
                <TabsTrigger value="directory" className="text-xs py-1.5"><Folder className="h-3.5 w-3.5 mr-1.5 hidden lg:block" /> Dir</TabsTrigger>
                <TabsTrigger value="dms" className="text-xs py-1.5"><User className="h-3.5 w-3.5 mr-1.5 hidden lg:block" /> Chats</TabsTrigger>
                <TabsTrigger value="groups" className="text-xs py-1.5"><Users className="h-3.5 w-3.5 mr-1.5 hidden lg:block" /> Groups</TabsTrigger>
                <TabsTrigger value="announcements" className="text-xs py-1.5"><Megaphone className="h-3.5 w-3.5 mr-1.5 hidden lg:block" /> Alerts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'directory' && <DirectoryTree onSelectChat={(id, name, role) => setActiveChatId(`dir-|${id}|${name}|${role}`)} />}
            {activeTab === 'dms' && mockDMs.map(chat => (
              <ChatItem key={chat.id} data={chat} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} icon={<User className="h-5 w-5" />} />
            ))}
            {activeTab === 'groups' && groups.map(chat => (
              <ChatItem key={chat.id} data={chat} isActive={activeChatId === chat.id} onClick={() => setActiveChatId(chat.id)} icon={<Users className="h-5 w-5" />} />
            ))}
            {activeTab === 'groups' && isAdmin && (
              <div className="p-4 border-t border-border mt-auto">
                <AddGroupModal onAdd={(newGroup) => setGroups(prev => [...prev, newGroup])} />
              </div>
            )}
            {activeTab === 'announcements' && mockAnnouncements.map(ann => (
              <ChatItem key={ann.id} data={{ ...ann, name: ann.title, lastMessage: ann.message }} isActive={activeChatId === ann.id} onClick={() => setActiveChatId(ann.id)} icon={<Megaphone className="h-5 w-5" />} />
            ))}
            {activeTab === 'announcements' && (
              <div className="p-4 border-t border-border mt-auto">
                <AddAnnouncementModal />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Conversation/Detail View */}
        <div className={cn(
          "flex-col bg-muted/10 transition-all duration-300",
          activeChatId ? "flex w-full md:flex-1" : "hidden md:flex flex-1 items-center justify-center text-muted-foreground"
        )}>
          {!activeChatId ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p>Select a conversation or announcement to view details.</p>
            </div>
          ) : activeTab === 'announcements' ? (
            // Announcement Detail View
            <AnnouncementDetail ann={activeChat as typeof mockAnnouncements[0]} onBack={() => setActiveChatId(null)} />
          ) : (
            // Chat View (DMs & Groups)
            <div className="flex flex-col h-full w-full">
              {/* Chat Header */}
              <div className="h-16 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setActiveChatId(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 relative">
                    {activeTab === 'dms' ? <User className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    {activeTab === 'dms' && (activeChat as any).online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-card rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-none">{(activeChat as any)?.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{(activeChat as any)?.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="text-center text-xs text-muted-foreground my-4">Today</div>
                {mockChatHistory.map(msg => (
                  <div key={msg.id} className={cn("flex flex-col max-w-[75%]", msg.senderId === 'me' ? "self-end items-end" : "self-start items-start")}>
                    <div className={cn("px-4 py-2 rounded-2xl", msg.senderId === 'me' ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm")}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                      {msg.time}
                      {msg.senderId === 'me' && (
                        msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="self-start text-xs text-muted-foreground flex items-center gap-1 mt-2">
                    <span className="italic">{(activeChat as any)?.name} is typing</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="animate-bounce inline-block">.</span>
                      <span className="animate-bounce inline-block" style={{ animationDelay: '0.1s' }}>.</span>
                      <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Composer */}
              <div className="p-4 bg-card border-t border-border mt-auto">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 bg-muted/50 border-none h-10"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" className="shrink-0 h-10 w-10" onClick={handleSendMessage} disabled={!inputText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function ChatItem({ data, isActive, onClick, icon }: { data: any, isActive: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
        isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30 border-l-2 border-l-transparent"
      )}
    >
      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center shrink-0 text-muted-foreground relative">
        {icon}
        {data.online && <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-card rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn("font-semibold text-sm truncate pr-2", data.unread ? "text-foreground" : "text-foreground/80")}>{data.name}</h4>
          <span className={cn("text-[10px] shrink-0", data.unread ? "text-primary font-bold" : "text-muted-foreground")}>{data.time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-xs truncate", data.unread ? "text-foreground font-medium" : "text-muted-foreground")}>{data.lastMessage}</p>
          {data.unread > 0 ? (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center shrink-0">{data.unread === true ? '!' : data.unread}</Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AnnouncementDetail({ ann, onBack }: { ann: typeof mockAnnouncements[0], onBack: () => void }) {
  return (
    <div className="flex flex-col h-full w-full bg-card">
      <div className="h-16 border-b border-border px-4 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-semibold text-sm">Announcement Details</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={ann.priority === 'High' ? 'destructive' : 'default'}>{ann.priority} Priority</Badge>
            <Badge variant="outline">Audience: {ann.audience}</Badge>
            <span className="text-xs text-muted-foreground ml-auto">{ann.time}</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">{ann.title}</h2>
          <div className="p-4 bg-muted/30 border border-border rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
            {ann.message}
          </div>
        </div>

        {ann.reqAck && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Megaphone className="h-4 w-4" />
              Acknowledgement Required
            </div>
            <Button size="sm">Acknowledge</Button>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Delivery Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{ann.metrics.delivered}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Delivered</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">{ann.metrics.read}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Read</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">{ann.metrics.ack}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Acknowledged</div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Attachments</h3>
          <div className="p-3 bg-muted/50 border border-border rounded-lg flex justify-between items-center text-sm cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">campaign_schedule_update.pdf</span>
            </div>
            <span className="text-muted-foreground text-xs">1.2 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddGroupModal({ onAdd }: { onAdd: (g: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Custom Group');

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({
      id: `g-${Date.now()}`,
      name,
      role,
      lastMessage: 'Group created.',
      time: 'Just now',
      unread: 0
    });
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2"><Users className="h-4 w-4" /> New Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input 
              placeholder="e.g. Ward 04 Core Team" 
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Group Purpose / Role</Label>
            <Input 
              placeholder="e.g. Operations" 
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddAnnouncementModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full gap-2"><Megaphone className="h-4 w-4" /> New Announcement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Broadcast Announcement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Schedule Change for Rally" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your announcement..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Audience Target</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>All Staff</option>
                <option>Campaign HQ</option>
                <option>Ward Coordinators</option>
                <option>House Coordinators</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Normal</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground">Require Acknowledgement</Label>
              <p className="text-xs text-muted-foreground">Recipients must click an acknowledge button.</p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button">Send Broadcast</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DirectoryTree({ onSelectChat }: { onSelectChat: (id: string, name: string, role: string) => void }) {
  const { users, wards, houses, volunteers } = useCampaignStore();
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>({});
  const [expandedHouses, setExpandedHouses] = useState<Record<string, boolean>>({});

  const toggleWard = (id: string) => setExpandedWards(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleHouse = (id: string) => setExpandedHouses(prev => ({ ...prev, [id]: !prev[id] }));

  // Identify top level users
  const directors = users.filter(u => u.role === 'Campaign Director' || u.role === 'Super Admin' || u.role === 'Candidate');

  return (
    <div className="flex flex-col p-3 space-y-3">
      {/* Leadership */}
      <div className="bg-card/40 backdrop-blur-md border-l-4 border-l-blue-500 border border-border/50 rounded-lg overflow-hidden shadow-sm">
        <div className="px-3 py-2 bg-muted/20 font-semibold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
          Campaign Leadership
        </div>
        <div className="flex flex-col">
          {directors.map(dir => (
            <button key={dir.id} onClick={() => onSelectChat(dir.id, dir.name, dir.role)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 text-left transition-colors">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{dir.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{dir.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Wards */}
      <div className="space-y-2">
        <div className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Territory Organization</div>
        {wards.map(ward => {
          const isWardExpanded = expandedWards[ward.id];
          const wardHouses = houses.filter(h => h.wardId === ward.id);
          
          return (
            <div key={ward.id} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center">
                <button onClick={() => toggleWard(ward.id)} className="p-2.5 hover:bg-muted/30 text-muted-foreground transition-colors">
                  {isWardExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <div className="flex-1 px-1 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-muted/10" onClick={() => onSelectChat(`ward-coord-${ward.id}`, ward.coordinator || 'Ward Coordinator', `Coordinator - ${ward.name}`)}>
                  <Folder className="h-4 w-4 text-emerald-500" />
                  <div className="flex-1 overflow-hidden text-left">
                    <p className="text-sm font-medium truncate">{ward.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">Coordinator: {ward.coordinator || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
              
              {isWardExpanded && (
                <div className="pl-8 pr-2 pb-2 space-y-1 bg-muted/5 border-t border-border/20">
                  {wardHouses.length === 0 && <p className="text-xs text-muted-foreground p-2">No houses assigned.</p>}
                  {wardHouses.map(house => {
                    const isHouseExpanded = expandedHouses[house.id];
                    const houseVolunteers = volunteers.filter(v => v.houseId === house.id);

                    return (
                      <div key={house.id} className="border-l-2 border-border/50 ml-2 mt-1 flex flex-col">
                        <div className="flex items-center">
                          <button onClick={() => toggleHouse(house.id)} className="p-1.5 hover:bg-muted/30 text-muted-foreground transition-colors ml-1">
                            {isHouseExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                          <div className="flex-1 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-muted/10 text-left" onClick={() => onSelectChat(`house-coord-${house.id}`, house.coordinator || 'House Coordinator', `Coordinator - ${house.name}`)}>
                            <Folder className="h-3.5 w-3.5 text-blue-400" />
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-medium truncate">{house.name}</p>
                            </div>
                          </div>
                        </div>

                        {isHouseExpanded && (
                          <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-border/30 ml-3">
                            {houseVolunteers.length === 0 && <p className="text-[10px] text-muted-foreground py-1">No volunteers.</p>}
                            {houseVolunteers.map(vol => (
                              <button key={vol.id} onClick={() => onSelectChat(`vol-${vol.id}`, vol.name, vol.role)} className="flex items-center gap-2 w-full py-1.5 px-2 hover:bg-muted/30 rounded-md text-left transition-colors">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-xs truncate">{vol.name}</p>
                                  <p className="text-[9px] text-muted-foreground truncate">{vol.role}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
