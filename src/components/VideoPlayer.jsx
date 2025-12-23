import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';


export function VideoPlayer({
  src,
  poster,
  className,
  isLive = false,
  title,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-foreground group', className)}>
      {/* Video placeholder */}
      <div className="aspect-video w-full bg-gradient-to-br from-sidebar to-foreground flex items-center justify-center">
        {isLive ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground mb-4">
              <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
              LIVE
            </div>
            <p className="text-muted text-lg font-medium">{title || 'Live Stream'}</p>
            <p className="text-muted-foreground text-sm mt-1">Stream will appear here</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-4 mx-auto">
              <Play className="h-10 w-10 text-primary-foreground ml-1" />
            </div>
            <p className="text-muted-foreground text-sm">{title || 'Video Player'}</p>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        {!isLive && (
          <div className="mb-3">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(value) => setProgress(value[0])}
              className="cursor-pointer"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            {!isLive && (
              <span className="text-xs text-primary-foreground/80">0:00 / 45:30</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground animate-pulse" />
                LIVE
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
