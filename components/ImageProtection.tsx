'use client';

import { useEffect } from 'react';

// Deterrent layer only — blocks casual right-click-save, drag-to-desktop,
// and iOS long-press save on photos. Determined users can always screenshot;
// the real protections are noimageindex and the no-names photo policy.
export default function ImageProtection() {
  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      if ((e.target as HTMLElement)?.tagName === 'IMG') e.preventDefault();
    }
    function onDragStart(e: DragEvent) {
      if ((e.target as HTMLElement)?.tagName === 'IMG') e.preventDefault();
    }
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return null;
}
