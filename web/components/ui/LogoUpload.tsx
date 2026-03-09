"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000" : "");

type LogoUploadProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
};

export function LogoUpload({
  value,
  onChange,
  label = "Logo",
  accept = "image/jpeg,image/png,image/gif,image/webp",
}: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/uploads/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        let message = "Upload failed";
        try {
          const data = text ? JSON.parse(text) : {};
          const msg = data.message;
          message = Array.isArray(msg) ? msg.join(", ") : msg || message;
        } catch {
          if (text) message = text.slice(0, 200);
        }
        throw new Error(message);
      }
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      const isConnectionRefused =
        message.includes("Failed to fetch") ||
        message.includes("NetworkError") ||
        message.includes("ECONNREFUSED") ||
        message.includes("connection refused");
      setError(
        isConnectionRefused
          ? "Backend server is not running. Start it: cd server && pnpm run start:dev"
          : message,
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
          id="logo-upload-input"
        />
        {value ? (
          <div className="flex items-center gap-3">
            <img
              src={value}
              alt="Logo"
              className="h-16 w-16 rounded-full object-cover border border-input"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 rounded border border-input px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-3 w-3" /> Remove
              </button>
              <label className="flex cursor-pointer items-center gap-1 rounded border border-input px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                {uploading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {uploading ? "Uploading…" : "Replace"}
                </span>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFile}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/30 px-6 py-4 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
            <span className="mt-2">
              {uploading ? "Uploading…" : "Choose image (JPEG, PNG, GIF, WebP)"}
            </span>
            <input
              type="file"
              accept={accept}
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
