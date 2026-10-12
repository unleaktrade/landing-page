import { lazy, Suspense, useState } from "react";

/*
 * Modals that only load once someone opens them, keeping their code (the
 * waitlist form, the QR code library) out of the main bundle every visitor
 * downloads. Each one stays mounted after its first open so the close
 * animation still plays.
 */

const WaitlistDialog = lazy(() =>
  import("./WaitlistDialog").then((m) => ({ default: m.WaitlistDialog }))
);
const QRCodeDialog = lazy(() =>
  import("./QRCodeDialog").then((m) => ({ default: m.QRCodeDialog }))
);

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function useOpenedOnce(open: boolean) {
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return opened || open;
}

export function LazyWaitlistDialog({ open, onOpenChange }: DialogProps) {
  if (!useOpenedOnce(open)) return null;
  return (
    <Suspense fallback={null}>
      <WaitlistDialog open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}

export function LazyQRCodeDialog({ open, onOpenChange }: DialogProps) {
  if (!useOpenedOnce(open)) return null;
  return (
    <Suspense fallback={null}>
      <QRCodeDialog open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}
