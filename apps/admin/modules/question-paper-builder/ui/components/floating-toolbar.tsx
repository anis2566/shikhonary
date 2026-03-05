"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Type,
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
  targetRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  currentStyle: ElementStyle;
  onStyleChange: (style: ElementStyle) => void;
  showAlignment?: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

const fontOptions = [
  { value: "SolaimanLipi", label: "SolaimanLipi" },
  { value: "Nikosh", label: "Nikosh" },
  { value: "Kalpurush", label: "Kalpurush" },
  { value: "Arial", label: "Arial" },
];

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  targetRef,
  isVisible,
  currentStyle,
  onStyleChange,
  showAlignment = true,
  onInteractionStart,
  onInteractionEnd,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const fontSize = currentStyle.fontSize || 14;
  const fontFamily = currentStyle.fontFamily || "SolaimanLipi";
  const textAlign = currentStyle.textAlign || "left";

  useEffect(() => {
    if (isVisible && targetRef.current && toolbarRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const toolbarRect = toolbarRef.current.getBoundingClientRect();

      // Position above the element
      let top = targetRect.top - toolbarRect.height - 8;
      let left = targetRect.left + targetRect.width / 2 - toolbarRect.width / 2;

      // Keep within viewport
      if (left < 10) left = 10;
      if (left + toolbarRect.width > window.innerWidth - 10) {
        left = window.innerWidth - toolbarRect.width - 10;
      }
      if (top < 60) {
        // Position below if not enough space above
        top = targetRect.bottom + 8;
      }

      setPosition({ top, left });
    }
  }, [isVisible, targetRef, currentStyle]);

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
      ref={toolbarRef}
      className={cn(
        "fixed z-[100] bg-popover border shadow-lg rounded-lg p-2 flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-200",
      )}
      style={{
        top: position.top,
        left: position.left,
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
      {/* Font Family - Using Popover instead of Select */}
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
    </div>
  );
};
