import { lazy, Suspense, useState, type ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { CALENDLY_PAGE_SETTINGS, CALENDLY_URL } from "@/lib/calendly";

// react-calendly is only downloaded when the button is first clicked, keeping it off the critical path.
const PopupModal = lazy(() => import("react-calendly").then((m) => ({ default: m.PopupModal })));

/** Opens the Calendly popup. Mounted only after a click so prerender never touches `document`. */
export function BookCallButton({
  children = "Schedule a Call",
  ...props
}: Omit<ButtonProps, "onClick" | "children"> & { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} {...props}>
        <CalendarDays className="mr-2 h-5 w-5" />
        {children}
      </Button>
      {open && (
        <Suspense fallback={null}>
          <PopupModal
            url={CALENDLY_URL}
            pageSettings={CALENDLY_PAGE_SETTINGS}
            open={open}
            onModalClose={() => setOpen(false)}
            rootElement={document.getElementById("root") as HTMLElement}
          />
        </Suspense>
      )}
    </>
  );
}
