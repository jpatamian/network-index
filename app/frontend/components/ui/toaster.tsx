import { Toaster as HotToaster, toast } from "react-hot-toast";

// Re-export Toaster component for placement in Layout
export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "system-ui, -apple-system, Arial, sans-serif",
          fontSize: "13px",
          border: "1px solid #d5d5d5",
          borderRadius: "0",
          padding: "8px 12px",
          color: "#333",
          background: "#fff",
        },
        success: {
          style: { borderColor: "#9c9", background: "#f0fff0", color: "#060" },
        },
        error: {
          style: { borderColor: "#e99", background: "#fff3f3", color: "#c00" },
        },
      }}
    />
  );
}

// Compat shim — matches existing toaster.success / toaster.error / toaster.create call sites
export const toaster = {
  success: ({ title, description }: { title: string; description?: string }) =>
    toast.success(description ? `${title}: ${description}` : title),
  error: ({ title, description }: { title: string; description?: string }) =>
    toast.error(description ? `${title}: ${description}` : title),
  create: ({
    title,
    description,
    type,
  }: {
    title: string;
    description?: string;
    type?: string;
  }) => {
    const msg = description ? `${title}: ${description}` : title;
    if (type === "error") return toast.error(msg);
    if (type === "success") return toast.success(msg);
    return toast(msg);
  },
};
