/**
 * Toast — context provider + tray renderer.
 *
 * Two pieces:
 *   <ToastProvider>  — wraps the app, supplies the toast context. No
 *                       visual output. Children optional.
 *   <ToastTray>      — paints the toast stack at the bottom-right.
 *                       Rendered once, anywhere in the tree.
 *
 * Why split: a hook (useToast) needs the provider above it. The tray
 * needs to be at the root of the visual stack for correct z-index
 * positioning. Putting them in the same component made the context
 * unavailable to siblings of where the tray lived.
 */
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { classNames } from "../../lib/utils/formatters";

type Kind = "success" | "info" | "error";
interface Toast {
  id: string;
  kind: Kind;
  title: string;
  body?: string;
}

interface Ctx {
  push: (t: Omit<Toast, "id">) => void;
}

const ToastCtx = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const v = useContext(ToastCtx);
  if (!v) throw new Error("useToast must be inside <ToastProvider>");
  return v;
}

const toneClass: Record<Kind, string> = {
  success: "bg-brand-primary text-text-inverse",
  info:    "bg-brand-dark text-text-inverse",
  error:   "bg-risk-crit text-text-inverse",
};

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((xs) => [...xs, { id, ...t }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3500);
  }, []);

  const ctx = useMemo<Ctx>(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <ToastTray items={items} />
    </ToastCtx.Provider>
  );
}

/**
 * Paint-only component. Useful if you want the tray physically rendered
 * somewhere other than the provider's children (e.g. inside a portal).
 * Most apps should not need this — <ToastProvider> already paints it.
 */
export function ToastTray({ items }: { items: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={classNames("rounded-card px-4 py-3 shadow-lift", toneClass[t.kind])}
            role="status"
          >
            <div className="text-sm font-medium">{t.title}</div>
            {t.body && <div className="text-xs opacity-90 mt-0.5">{t.body}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Backwards-compat alias. Existing code that imports { ToastHost } keeps
 * working — it just becomes the provider (which paints its own tray).
 * @deprecated Use ToastProvider directly.
 */
export function ToastHost({ children }: { children?: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}