"use client";

import { useEffect } from "react";
import { useBuilderUI, useBuilderActions } from "./builder-context";

export const useBuilderShortcuts = () => {
  const {
    setIsEditing,
    setZoom,
    setSidebarTab,
    setShowShortcuts,
  } = useBuilderUI();

  const {
    handleExportPdf,
    handleGlobalSave,
  } = useBuilderActions();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "e") {
        e.preventDefault();
        setIsEditing(true); // Toggle logic would be better but keeping simple for now
      } else if (ctrl && e.key === "s") {
        e.preventDefault();
        handleGlobalSave();
      } else if (ctrl && e.key === "p") {
        e.preventDefault();
        handleExportPdf();
      } else if (ctrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoom((prev: any) => (typeof prev === "number" ? Math.min(2, prev + 0.1) : 0.7));
      } else if (ctrl && e.key === "-") {
        e.preventDefault();
        setZoom((prev: any) => (typeof prev === "number" ? Math.max(0.25, prev - 0.1) : 0.5));
      } else if (ctrl && e.key === "0") {
        e.preventDefault();
        setZoom("auto");
      } else if (ctrl && e.key === "1") {
        e.preventDefault();
        setSidebarTab("settings");
      } else if (ctrl && e.key === "2") {
        e.preventDefault();
        setSidebarTab("picker");
      } else if (ctrl && e.key === "3") {
        e.preventDefault();
        setSidebarTab("reorder");
      } else if (e.key === "?" && !ctrl) {
        e.preventDefault();
        setShowShortcuts((v: boolean) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setIsEditing, handleExportPdf, setZoom, setSidebarTab, setShowShortcuts, handleGlobalSave]);
};
