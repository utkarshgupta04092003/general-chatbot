import { AlertCircle, FileText, Loader2, X } from "lucide-react";
import { useState } from "react";

type ManualDataSourceModalProps = {
  isOpen: boolean;
  adding: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (title: string, content: string, type: "text") => void;
};

export function ManualDataSourceModal({
  isOpen,
  adding,
  error,
  onClose,
  onConfirm,
}: ManualDataSourceModalProps) {
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim() || !textContent.trim()) return;
    onConfirm(title.trim(), textContent, "text");
  };

  const resetAndClose = () => {
    setTitle("");
    setTextContent("");
    onClose();
  };

  const isSubmitDisabled = adding || !title.trim() || !textContent.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-e3 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">Add Manual Source</h2>
          <button
            onClick={resetAndClose}
            className="p-1 text-muted-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 bg-danger/10 border border-red-500/20 text-danger px-4 py-3 rounded-md text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Company Overview"
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your text content here..."
                rows={8}
                className="w-full px-4 py-3 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/20">
          <button
            onClick={resetAndClose}
            disabled={adding}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium rounded-md transition-all"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {adding ? "Adding..." : "Add Source"}
          </button>
        </div>
      </div>
    </div>
  );
}
