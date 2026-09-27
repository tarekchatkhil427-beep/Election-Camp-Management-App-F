import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const MODULES = [
  'Dashboard', 'Organization', 'Voters', 'Tasks', 
  'Events', 'Issues', 'Social Media', 'Messages', 'Finance', 'Settings'
];

const ROLES = [
  'Super Admin', 'Candidate', 'Campaign Director', 
  'Ward Coordinator', 'House Coordinator', 'Volunteer'
];

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'];

export default function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState(ROLES[2]); // Campaign Director as default demo
  
  // Mock state for checkboxes
  const [matrixState, setMatrixState] = useState<Record<string, Record<string, boolean>>>(
    MODULES.reduce((acc, mod) => {
      acc[mod] = PERMISSIONS.reduce((pAcc, p) => {
        // Just mock some defaults based on random logic to look realistic
        pAcc[p] = (mod === 'Dashboard' && p === 'View') || (p !== 'Delete' && p !== 'Export');
        return pAcc;
      }, {} as Record<string, boolean>);
      return acc;
    }, {} as Record<string, Record<string, boolean>>)
  );

  const togglePermission = (module: string, perm: string) => {
    setMatrixState(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [perm]: !prev[module][perm]
      }
    }));
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Permission Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure granular access rights for each role.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Select Role:</span>
          <select 
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-48"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-foreground/90">
          <strong>Note:</strong> Super Admin permissions cannot be modified. Any changes made to {selectedRole} will apply to all users assigned this role immediately upon saving.
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Module</th>
                {PERMISSIONS.map(p => (
                  <th key={p} className="px-4 py-4 text-center">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MODULES.map((module) => (
                <tr key={module} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium text-foreground">{module}</td>
                  {PERMISSIONS.map(perm => (
                    <td key={perm} className="px-4 py-4 text-center align-middle">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={matrixState[module][perm]} 
                          onCheckedChange={() => togglePermission(module, perm)}
                          disabled={selectedRole === 'Super Admin'}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
        <Button variant="outline">Discard Changes</Button>
        <Button className="gap-2"><ShieldCheck className="h-4 w-4" /> Save Permissions</Button>
      </div>
    </div>
  );
}
