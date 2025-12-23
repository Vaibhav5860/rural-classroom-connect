import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState({ open: false, title: '', description: '', confirmText: 'Confirm', cancelText: 'Cancel' });
  const resolverRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setOpts({ open: true, title: options.title || 'Confirm', description: options.description || '', confirmText: options.confirmText || 'Confirm', cancelText: options.cancelText || 'Cancel' });
    });
  }, []);

  const handleClose = (result) => {
    setOpts((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={opts.open} onOpenChange={(open) => { if (!open) handleClose(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{opts.title}</DialogTitle>
          </DialogHeader>
          {opts.description && <p className="text-sm text-muted-foreground">{opts.description}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>{opts.cancelText}</Button>
            <Button onClick={() => handleClose(true)}>{opts.confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}
