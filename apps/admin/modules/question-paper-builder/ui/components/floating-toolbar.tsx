"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Type,
  Columns,
  Rows,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

import { cn } from "@workspace/ui/lib/utils";

import { ElementStyle } from "./types";

interface FloatingToolbarProps {
  target: HTMLElement | null;
  isVisible: boolean;
  currentStyle: ElementStyle;
  onStyleChange: (style: ElementStyle) => void;
  showAlignment?: boolean;
  optionsColumns?: 1 | 2;
  onOptionsColumnsChange?: (cols: 1 | 2) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

const fontOptions = [
  { value: "SolaimanLipi", label: "SolaimanLipi" },
  { value: "Nikosh", label: "Nikosh" },
  { value: "Kalpurush", label: "Kalpurush" },
  { value: "Arial", label: "Arial" },
];

export const FloatingToolbar = React.forwardRef<
  HTMLDivElement,
  FloatingToolbarProps
>(function FloatingToolbar(
  {
    target,
    isVisible,
    currentStyle,
    onStyleChange,
    showAlignment = true,
    optionsColumns,
    onOptionsColumnsChange,
    onInteractionStart,
    onInteractionEnd,
  },
  ref,
) {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const fontSize = currentStyle.fontSize || 14;
  const fontFamily = currentStyle.fontFamily || "SolaimanLipi";
  const textAlign = currentStyle.textAlign || "left";

  useEffect(() => {
    if (!isVisible || !target) {
      setPosition(null);
      return;
    }

    const calcPosition = () => {
      const el = toolbarRef.current;
      const targetRect = target.getBoundingClientRect();

      // Use measured dimensions if available, fall back to estimates
      const toolbarWidth = el ? el.offsetWidth : 320;
      const toolbarHeight = el ? el.offsetHeight : 44;

      let top = targetRect.top - toolbarHeight - 8;
      let left = targetRect.left + targetRect.width / 2 - toolbarWidth / 2;

      if (left < 10) left = 10;
      if (left + toolbarWidth > window.innerWidth - 10) {
        left = window.innerWidth - toolbarWidth - 10;
      }
      // Not enough space above → show below
      if (top < 60) {
        top = targetRect.bottom + 8;
      }

      setPosition({ top, left });
    };

    // First pass — positions using estimated or current toolbar dimensions
    calcPosition();

    // Second pass — after browser paints the toolbar, remeasure with actual
    // toolbar size and correct the position if needed (fixes first-mount offset)
    const rafId = requestAnimationFrame(calcPosition);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, target, currentStyle]);

  if (!isVisible) return null;

  const updateStyle = (updates: Partial<ElementStyle>) => {
    onStyleChange({ ...currentStyle, ...updates });
  };

  const handleFontSelect = (font: string) => {
    updateStyle({ fontFamily: font });
    setFontPopoverOpen(false);
    onInteractionEnd?.();
  };

  return (
    <div
      ref={(node) => {
        (toolbarRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "fixed z-[100] bg-popover/95 backdrop-blur-xl border shadow-xl rounded-xl p-2 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-200",
      )}
      style={{
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        // Hidden until position is calculated to avoid flash at (0,0)
        visibility: position ? "visible" : "hidden",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseEnter={() => onInteractionStart?.()}
      onMouseLeave={() => {
        if (!fontPopoverOpen) {
          onInteractionEnd?.();
        }
      }}
    >
      {/* Font Family */}
      <Popover
        open={fontPopoverOpen}
        onOpenChange={(open) => {
          setFontPopoverOpen(open);
          if (open) {
            onInteractionStart?.();
          } else {
            onInteractionEnd?.();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-28 h-8 text-xs justify-start gap-1"
          >
            <Type className="w-3 h-3" />
            <span className="truncate">{fontFamily}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-32 p-1 z-[110] bg-popover border shadow-lg"
          align="start"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {fontOptions.map((font) => (
            <button
              key={font.value}
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent",
                fontFamily === font.value && "bg-accent font-medium",
              )}
              onClick={() => handleFontSelect(font.value)}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border" />

      {/* Font Size */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateStyle({ fontSize: Math.max(10, fontSize - 1) })}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-xs font-medium w-6 text-center">{fontSize}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateStyle({ fontSize: Math.min(32, fontSize + 1) })}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {showAlignment && (
        <>
          <div className="w-px h-6 bg-border" />

          {/* Text Alignment */}
          <ToggleGroup
            type="single"
            value={textAlign}
            onValueChange={(v) =>
              v && updateStyle({ textAlign: v as "left" | "center" | "right" })
            }
            className="gap-0"
          >
            <ToggleGroupItem value="left" size="sm" className="h-7 w-7 p-0">
              <AlignLeft className="w-3 h-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" size="sm" className="h-7 w-7 p-0">
              <AlignCenter className="w-3 h-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" size="sm" className="h-7 w-7 p-0">
              <AlignRight className="w-3 h-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}

      {onOptionsColumnsChange && (
        <>
          <div className="w-px h-6 bg-border" />

          {/* Option Columns Control */}
          <ToggleGroup
            type="single"
            value={optionsColumns?.toString() || "0"}
            onValueChange={(v) =>
              v && onOptionsColumnsChange(parseInt(v) as 1 | 2)
            }
            className="gap-0"
          >
            <ToggleGroupItem
              value="1"
              size="sm"
              className="h-7 w-7 p-0"
              title="1 Column Options"
            >
              <Rows className="w-3 h-3" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="2"
              size="sm"
              className="h-7 w-7 p-0"
              title="2 Column Options"
            >
              <Columns className="w-3 h-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}
    </div>
  );
});

FloatingToolbar.displayName = "FloatingToolbar";
