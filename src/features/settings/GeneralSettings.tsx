import React, { useState, useEffect } from 'react';
import { Upload, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCampaignStore } from '@/store/campaignStore';
import { cn } from '@/lib/utils';

export default function GeneralSettings() {
  const { settings, updateSettings } = useCampaignStore();
  
  // Local state to hold edits before saving
  const [formData, setFormData] = useState(settings);

  // Sync if store updates externally
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    toast.success('General settings saved successfully');
  };

  const handleCancel = () => {
    setFormData(settings); // Revert to stored settings
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Campaign Settings */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">Campaign Details</h2>
          <p className="text-sm text-muted-foreground mt-1">Basic information about the campaign and candidate.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input value={formData.campaignName} onChange={e => handleChange('campaignName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Candidate Name</Label>
            <Input value={formData.candidateName} onChange={e => handleChange('candidateName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Election Type</Label>
            <select 
              value={formData.electionType}
              onChange={e => handleChange('electionType', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Local Government</option>
              <option>Mayoral</option>
              <option>Parliamentary</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Election Date</Label>
            <Input type="date" value={formData.electionDate} onChange={e => handleChange('electionDate', e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Location / Region</Label>
            <Input value={formData.location} onChange={e => handleChange('location', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Brand & Logo */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">Brand Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload campaign logos and set brand colors.</p>
        </div>
        <div className="p-6 flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="h-32 w-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mb-2" />
              <span className="text-xs font-medium">Upload Logo</span>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Label>Primary Brand Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-md border border-border shadow-inner" 
                  style={{ backgroundColor: formData.primaryColor }}
                />
                <Input value={formData.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="w-32 font-mono" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Settings */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold">Interface</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize how the application looks and feels.</p>
        </div>
        <div className="p-6 grid gap-8">
          <div className="space-y-3">
            <Label>Theme Preference</Label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <Button 
                variant="outline" 
                onClick={() => handleChange('theme', 'Light')}
                className={cn("h-20 flex flex-col gap-2", formData.theme === 'Light' ? "border-primary bg-primary/5" : "")}
              >
                <Sun className="h-5 w-5" /> Light
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleChange('theme', 'Dark')}
                className={cn("h-20 flex flex-col gap-2", formData.theme === 'Dark' ? "border-primary bg-primary/5" : "")}
              >
                <Moon className="h-5 w-5" /> Dark
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleChange('theme', 'System')}
                className={cn("h-20 flex flex-col gap-2", formData.theme === 'System' ? "border-primary bg-primary/5" : "")}
              >
                <Monitor className="h-5 w-5" /> System
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <select 
                value={formData.language}
                onChange={e => handleChange('language', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>English (US)</option>
                <option>Bengali (BD)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Information Density</Label>
              <select 
                value={formData.density}
                onChange={e => handleChange('density', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Comfortable (Default)</option>
                <option>Compact (Data-heavy)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 mb-8">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
