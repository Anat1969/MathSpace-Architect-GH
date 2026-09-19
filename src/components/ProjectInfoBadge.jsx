import { MapPin, User, Building2 } from 'lucide-react';

export default function ProjectInfoBadge({ name, architect, location, type }) {
  if (!name && !architect) return null;
  return (
    <div className="bg-muted/60 border border-border/50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
      {name && (
        <div className="font-heebo font-bold text-foreground">{name}</div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {architect && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 shrink-0" />
            {architect}
          </span>
        )}
        {type && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 shrink-0" />
            {type}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {location}
          </span>
        )}
      </div>
    </div>
  );
}