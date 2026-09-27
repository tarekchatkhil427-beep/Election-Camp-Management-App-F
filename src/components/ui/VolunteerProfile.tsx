import React from 'react';
import { Phone, MapPin, CheckCircle2, UserCircle2, Edit, Trash2 } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';

import { Volunteer } from '@/store/campaignStore';

interface VolunteerProfileProps {
  volunteer: Volunteer;
  wardName?: string;
  coordinatorName?: string;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function VolunteerProfile({ volunteer, wardName, coordinatorName, className, onEdit, onDelete }: VolunteerProfileProps) {
  return (
    <div className={cn("flex items-start gap-4 p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow", className)}>
      <UserCircle2 className="h-12 w-12 text-muted-foreground shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground truncate">{volunteer.name}</h4>
            <Badge variant={volunteer.status === 'Active' ? 'success' : 'secondary'}>
              {volunteer.status}
            </Badge>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-primary font-medium mt-0.5">{volunteer.role}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {volunteer.phone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {wardName || volunteer.wardId} • {volunteer.houseId}
          </span>
          <span className="flex items-center gap-1">
            <UserCircle2 className="h-3.5 w-3.5" />
            Coord: {coordinatorName || 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {volunteer.taskCount} Tasks
          </span>
        </div>
      </div>
    </div>
  );
}
