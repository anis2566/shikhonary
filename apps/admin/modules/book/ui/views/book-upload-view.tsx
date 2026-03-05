"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  BookOpen,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export const BookUploadView = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [version, setVersion] = useState<"Bangla" | "English">("Bangla");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else setErrorMsg("Only PDF files are accepted.");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    if (picked?.type !== "application/pdf") {
      setErrorMsg("Only PDF files are accepted.");
      return;
    }
    setFile(picked);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !classLevel || !version) return;

    setStatus("uploading");
    setProgress(0);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("classLevel", classLevel);
      form.append("version", version);

      // Simulate progress (XHR doesn't exist in RSC; use fetch with periodic updates)
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 90));
      }, 400);

      const res = await fetch("/api/pdf/upload", {
        method: "POST",
        body: form,
      });
      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Upload failed");
      }

      const { bookId } = await res.json();
      setStatus("success");

      // Redirect to book detail page after 1.2s
      setTimeout(() => router.push(`/books/${bookId}`), 1200);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  };

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : null;
  const canSubmit =
    file && title && classLevel && version && status !== "uploading";

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── Drop Zone ────────────────────────────────────────────── */}
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : file
                ? "border-emerald-500/60 bg-emerald-500/5"
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30",
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileInput}
          />

          {file ? (
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fileSizeMB} MB · PDF
                </p>
              </div>
              <p className="text-xs text-primary font-medium">
                Click to change file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  Drop your PDF here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse — max 100 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Metadata Form ─────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card/80 backdrop-blur-xl rounded-[2rem] border border-border/60 p-8 space-y-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Book Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-foreground/80"
                >
                  Book Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. পদার্থবিজ্ঞান"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-xl bg-muted/30 border-border/40 focus:border-primary/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="classLevel"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Class Level
                  </Label>
                  <Select
                    value={classLevel}
                    onValueChange={setClassLevel}
                    required
                  >
                    <SelectTrigger
                      id="classLevel"
                      className="h-12 rounded-xl bg-muted/30 border-border/40"
                    >
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {[6, 7, 8, 9, 10, 11, 12].map((cls) => (
                        <SelectItem key={cls} value={String(cls)}>
                          Class {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="version"
                    className="text-sm font-semibold text-foreground/80"
                  >
                    Version
                  </Label>
                  <Select
                    value={version}
                    onValueChange={(v) => setVersion(v as "Bangla" | "English")}
                  >
                    <SelectTrigger
                      id="version"
                      className="h-12 rounded-xl bg-muted/30 border-border/40"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangla">Bangla</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Error message ─────────────────────────────────────── */}
          {errorMsg && (
            <div className="flex items-center gap-3 px-5 py-4 bg-destructive/10 border border-destructive/25 rounded-2xl text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* ── Upload progress bar ───────────────────────────────── */}
          {status === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Uploading PDF &amp; starting extraction pipeline…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Submit Button ─────────────────────────────────────── */}
          <Button
            type="submit"
            disabled={!canSubmit}
            size="lg"
            className={cn(
              "w-full h-14 rounded-2xl text-base font-bold transition-all duration-300",
              status === "success"
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : "gradient-primary shadow-glow",
            )}
          >
            {status === "uploading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing…
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Uploaded! Redirecting…
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload &amp; Start Extraction
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
