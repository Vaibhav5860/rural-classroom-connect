import { FileText, Video, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';



const typeConfig = {
  pdf: { icon: FileText, color: 'bg-destructive/10 text-destructive', label: 'PDF' },
  video: { icon: Video, color: 'bg-info/10 text-info', label: 'Video' },
  document: { icon: FileText, color: 'bg-primary/10 text-primary', label: 'Document' },
  other: { icon: FileText, color: 'bg-muted text-muted-foreground', label: 'File' },
};

export function MaterialCard({
  id,
  title,
  type,
  uploadedAt,
  downloadUrl,
  onView,
  onDownload,
}) {
  const config = typeConfig[type] || typeConfig.other;
  const Icon = config.icon;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', config.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', config.color)}>
                {config.label}
              </span>
              {uploadedAt && (
                <span className="text-xs text-muted-foreground">{uploadedAt}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onView && (
              <Button variant="ghost" size="icon" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {(onDownload || downloadUrl) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                asChild={!!downloadUrl}
              >
                {downloadUrl ? (
                  <a href={downloadUrl} download>
                    <Download className="h-4 w-4" />
                  </a>
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
