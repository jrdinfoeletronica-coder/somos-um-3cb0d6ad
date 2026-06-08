import { Music, ExternalLink, Play, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SongCardProps {
  id?: string;
  title: string;
  artist?: string;
  tone: string;
  bpm?: number;
  timesPlayed?: number;
  youtubeUrl?: string;
  spotifyUrl?: string;
  variant?: "default" | "compact";
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SongCard({
  title,
  artist,
  tone,
  bpm,
  timesPlayed,
  youtubeUrl,
  spotifyUrl,
  variant = "default",
  showActions = false,
  onEdit,
  onDelete,
}: SongCardProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 p-4 card-church">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
          <Music className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{title}</h4>
          {artist && (
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-secondary rounded-md font-medium text-foreground">
            {tone}
          </span>
          {bpm && (
            <span className="text-muted-foreground">{bpm} BPM</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card-church p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shrink-0">
          <Music className="w-7 h-7 text-accent" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-display text-xl font-semibold text-foreground truncate">
            {title}
          </h3>
          {artist && (
            <p className="text-sm text-muted-foreground">{artist}</p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <span className="px-2.5 py-1 bg-accent/10 rounded-md text-sm font-semibold text-accent">
              Tom: {tone}
            </span>
            {bpm && (
              <span className="text-sm text-muted-foreground">
                {bpm} BPM
              </span>
            )}
            {timesPlayed !== undefined && (
              <span className="text-sm text-muted-foreground">
                <Play className="w-3.5 h-3.5 inline mr-1" />
                {timesPlayed}x tocada
              </span>
            )}
          </div>
        </div>
      </div>

      {(youtubeUrl || spotifyUrl || showActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            {youtubeUrl && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => window.open(youtubeUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                YouTube
              </Button>
            )}
            {spotifyUrl && (
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => window.open(spotifyUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Spotify
              </Button>
            )}
          </div>
          {showActions && (
            <div className="flex items-center gap-2 justify-end sm:ml-auto">
              <Button variant="soft" size="sm" onClick={onEdit} className="h-8">
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remover
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
