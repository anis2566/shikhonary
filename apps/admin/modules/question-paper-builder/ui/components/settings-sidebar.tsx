"use client";

import React from "react";
import {
  Download,
  FileText,
  Layout,
  Type,
  Shuffle,
  Stamp,
  Eye,
  Circle,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { cn } from "@workspace/ui/lib/utils";

import { PaperSettings, PaperSubjectBreakdown } from "./types";

const FONT_FAMILIES = [
  { value: "SolaimanLipi", label: "সোলাইমানলিপি" },
  { value: "Kalpurush", label: "কালপুরুষ" },
  { value: "Nikosh", label: "নিকষ" },
  { value: "AdorshoLipi", label: "আদর্শলিপি" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
];

const PAPER_SIZES = [
  { value: "A4", label: "A4", width: 210, height: 297 },
  { value: "Letter", label: "Letter", width: 216, height: 279 },
  { value: "Legal", label: "Legal", width: 216, height: 356 },
  { value: "A5", label: "A5", width: 148, height: 210 },
] as const;

interface SettingsSidebarProps {
  settings: PaperSettings;
  subjects?: PaperSubjectBreakdown[];
  onSettingsChange: (settings: PaperSettings) => void;
  onExportPdf: () => void;
  isExporting: boolean;
}

// Sub-components moved outside to avoid re-creation on render
const MarginPreview = ({
  orientation,
  margins,
}: {
  orientation: string;
  margins: { top: number; bottom: number; left: number; right: number };
}) => {
  const scale = 0.15;
  const pageW = orientation === "portrait" ? 60 : 80;
  const pageH = orientation === "portrait" ? 80 : 60;

  return (
    <div className="flex justify-center py-2">
      <div
        className="relative border-2 border-primary/30 bg-background rounded shadow-sm"
        style={{ width: pageW, height: pageH }}
      >
        <div
          className="absolute bg-primary/10 border border-dashed border-primary/40 rounded-sm"
          style={{
            top: margins.top * scale,
            left: margins.left * scale,
            right: margins.right * scale,
            bottom: margins.bottom * scale,
          }}
        >
          <div className="p-1 space-y-0.5">
            <div className="h-0.5 bg-primary/20 rounded w-full" />
            <div className="h-0.5 bg-primary/20 rounded w-3/4" />
            <div className="h-0.5 bg-primary/20 rounded w-5/6" />
          </div>
        </div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">
          {margins.top}
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">
          {margins.bottom}
        </div>
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 text-[8px] text-muted-foreground">
          {margins.left}
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-[8px] text-muted-foreground">
          {margins.right}
        </div>
      </div>
    </div>
  );
};

const MarginInput = ({
  label,
  value,
  onAdjust,
  icon,
}: {
  label: string;
  value: number;
  onAdjust: (delta: number) => void;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onAdjust(-5)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onAdjust(5)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

const PaperSizeCard = ({
  size,
  label,
  isSelected,
  onClick,
}: {
  size: (typeof PAPER_SIZES)[number]["value"];
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const sizeInfo = PAPER_SIZES.find((s) => s.value === size)!;
  const aspectRatio = sizeInfo.width / sizeInfo.height;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-transparent bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/20",
      )}
    >
      <div
        className={cn(
          "rounded border-2 transition-colors flex items-center justify-center",
          isSelected
            ? "border-primary bg-background"
            : "border-muted-foreground/30 bg-background/50",
        )}
        style={{
          width: 28,
          height: 28 / aspectRatio,
        }}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>
      <span
        className={cn(
          "text-xs font-medium transition-colors",
          isSelected
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {sizeInfo.width}×{sizeInfo.height}
      </span>
    </button>
  );
};

const OrientationCard = ({
  label,
  isPortrait,
  isSelected,
  onClick,
}: {
  label: string;
  isPortrait: boolean;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
      isSelected
        ? "border-primary bg-primary/5"
        : "border-transparent bg-muted/30 hover:bg-muted/50",
    )}
  >
    <div
      className={cn(
        "rounded border-2 transition-colors",
        isSelected
          ? "border-primary bg-background"
          : "border-muted-foreground/30 bg-background/50",
      )}
      style={{
        width: isPortrait ? 20 : 32,
        height: isPortrait ? 28 : 20,
      }}
    />
    <span
      className={cn(
        "text-xs font-medium",
        isSelected ? "text-primary" : "text-muted-foreground",
      )}
    >
      {label}
    </span>
  </button>
);

const ColumnCard = ({
  cols,
  isSelected,
  onClick,
}: {
  cols: 1 | 2 | 3;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
      isSelected
        ? "border-primary bg-primary/5"
        : "border-transparent bg-muted/30 hover:bg-muted/50",
    )}
  >
    <div className="flex gap-0.5">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-sm border transition-colors",
            isSelected
              ? "border-primary bg-primary/20"
              : "border-muted-foreground/30 bg-muted",
          )}
          style={{ width: 28 / cols - 2, height: 32 }}
        />
      ))}
    </div>
    <span
      className={cn(
        "text-xs font-medium",
        isSelected ? "text-primary" : "text-muted-foreground",
      )}
    >
      {cols} কলাম
    </span>
  </button>
);

const OptionStyleCard = ({
  isSelected,
  display,
  onClick,
}: {
  isSelected: boolean;
  display: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 min-w-[60px]",
      isSelected
        ? "border-primary bg-primary/5"
        : "border-transparent bg-muted/30 hover:bg-muted/50",
    )}
  >
    <span
      className={cn(
        "text-sm font-medium",
        isSelected ? "text-primary" : "text-muted-foreground",
      )}
    >
      {display}
    </span>
  </button>
);

const FontWeightCard = ({
  isSelected,
  label,
  weightClass,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  weightClass: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 p-2.5 rounded-lg border-2 transition-all duration-200",
      isSelected
        ? "border-primary bg-primary/5"
        : "border-transparent bg-muted/30 hover:bg-muted/50",
    )}
  >
    <span
      className={cn(
        "text-xs",
        weightClass,
        isSelected ? "text-primary" : "text-muted-foreground",
      )}
    >
      {label}
    </span>
  </button>
);

const ToggleItem = ({
  label,
  description,
  checked,
  onCheckedChange,
  icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) => (
  <div
    className={cn(
      "p-3 rounded-xl border-2 transition-all duration-200",
      checked
        ? "border-primary/30 bg-primary/5"
        : "border-transparent bg-muted/20",
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={cn(
              "p-1.5 rounded-lg",
              checked
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {icon}
          </div>
        )}
        <div>
          <Label className="text-sm font-medium cursor-pointer">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </div>
);

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  settings,
  subjects = [],
  onSettingsChange,
  onExportPdf,
  isExporting,
}) => {
  const updateSetting = <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K],
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  // Ensure margins has default values
  const margins = settings.margins ?? {
    top: 20,
    bottom: 20,
    left: 15,
    right: 15,
  };

  const updateMargin = (
    side: "top" | "bottom" | "left" | "right",
    value: number,
  ) => {
    onSettingsChange({
      ...settings,
      margins: { ...margins, [side]: value },
    });
  };

  const adjustMargin = (
    side: "top" | "bottom" | "left" | "right",
    delta: number,
  ) => {
    const currentValue = margins[side] ?? 20;
    const newValue = Math.max(5, Math.min(50, currentValue + delta));
    updateMargin(side, newValue);
  };

  return (
    <div className="w-full border-l bg-muted/10 flex flex-col h-full overflow-hidden">
      {/* Header with Export Button */}
      <div className="p-4 border-b bg-background space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">ডকুমেন্ট সেটিংস</h2>
            <p className="text-xs text-muted-foreground">কাস্টমাইজ করুন</p>
          </div>
        </div>
        <Button
          onClick={onExportPdf}
          disabled={isExporting}
          className="w-full gap-2"
          size="lg"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "এক্সপোর্ট হচ্ছে..." : "PDF ডাউনলোড করুন"}
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3">
          <Accordion
            type="multiple"
            defaultValue={["page-setup", "header-visibility"]}
            className="space-y-1"
          >
            {/* Page Setup */}
            <AccordionItem
              value="page-setup"
              className="border rounded-xl bg-background px-3"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Layout className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-medium">পেজ সেটআপ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Paper Size */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    পেপার সাইজ
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PAPER_SIZES.map((size) => (
                      <PaperSizeCard
                        key={size.value}
                        size={size.value}
                        label={size.label}
                        isSelected={settings.paperSize === size.value}
                        onClick={() => updateSetting("paperSize", size.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Orientation */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    অরিয়েন্টেশন
                  </Label>
                  <div className="flex gap-2">
                    <OrientationCard
                      label="পোর্ট্রেট"
                      isPortrait
                      isSelected={settings.paperOrientation === "portrait"}
                      onClick={() =>
                        updateSetting("paperOrientation", "portrait")
                      }
                    />
                    <OrientationCard
                      label="ল্যান্ডস্কেপ"
                      isPortrait={false}
                      isSelected={settings.paperOrientation === "landscape"}
                      onClick={() =>
                        updateSetting("paperOrientation", "landscape")
                      }
                    />
                  </div>
                </div>

                {/* Margins with visual preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                      মার্জিন (mm)
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs gap-1"
                      onClick={() => {
                        updateMargin("top", 20);
                        updateMargin("bottom", 20);
                        updateMargin("left", 15);
                        updateMargin("right", 15);
                      }}
                    >
                      <RotateCcw className="w-3 h-3" />
                      রিসেট
                    </Button>
                  </div>
                  <MarginPreview
                    orientation={settings.paperOrientation}
                    margins={margins}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <MarginInput
                      label="উপর"
                      value={margins.top}
                      onAdjust={(delta) => adjustMargin("top", delta)}
                    />
                    <MarginInput
                      label="নীচে"
                      value={margins.bottom}
                      onAdjust={(delta) => adjustMargin("bottom", delta)}
                    />
                    <MarginInput
                      label="বাম"
                      value={margins.left}
                      onAdjust={(delta) => adjustMargin("left", delta)}
                    />
                    <MarginInput
                      label="ডান"
                      value={margins.right}
                      onAdjust={(delta) => adjustMargin("right", delta)}
                    />
                  </div>
                </div>

                {/* Columns */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    কলাম লেআউট
                  </Label>
                  <div className="flex gap-2">
                    <ColumnCard
                      cols={1}
                      isSelected={settings.columns === 1}
                      onClick={() => updateSetting("columns", 1)}
                    />
                    <ColumnCard
                      cols={2}
                      isSelected={settings.columns === 2}
                      onClick={() => updateSetting("columns", 2)}
                    />
                    <ColumnCard
                      cols={3}
                      isSelected={settings.columns === 3}
                      onClick={() => updateSetting("columns", 3)}
                    />
                  </div>
                  <ToggleItem
                    label="কলাম ডিভাইডার"
                    checked={settings.showColumnDivider}
                    onCheckedChange={(v) =>
                      updateSetting("showColumnDivider", v)
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Header Visibility */}
            <AccordionItem
              value="header-visibility"
              className="border rounded-xl bg-background px-3"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-500/10">
                    <Eye className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="font-medium">হেডার দৃশ্যমানতা</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {[
                  { key: "showClassName", label: "শ্রেণির নাম" },
                  { 
                    key: "showSubjectName", 
                    label: "বিষয়ের নাম", 
                    disabled: subjects.length > 1,
                    description: subjects.length > 1 ? "একাধিক বিষয় থাকায় হেডার থেকে নাম সরানো হয়েছে" : undefined
                  },
                  { key: "showChapterName", label: "অধ্যায়ের নাম" },
                  { key: "showSetCode", label: "সেট কোড" },
                  { key: "showExamName", label: "পরীক্ষার নাম" },
                  { key: "showTime", label: "সময়" },
                  { key: "showTotalMarks", label: "পূর্ণমান" },
                  { key: "showInstructions", label: "নির্দেশনা" },
                  { key: "showNoMarkingNote", label: "দাগ/চিহ্ন নোট" },
                  { key: "showReference", label: "প্রশ্নের রেফারেন্স" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg transition-colors",
                      settings[item.key as keyof PaperSettings]
                        ? "bg-green-500/5"
                        : "bg-muted/30",
                      (item as any).disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex flex-col">
                      <Label className={cn("text-sm cursor-pointer", (item as any).disabled && "cursor-not-allowed")}>
                        {item.label}
                      </Label>
                      {(item as any).description && (
                        <span className="text-[10px] text-muted-foreground">{(item as any).description}</span>
                      )}
                    </div>
                    <Switch
                      checked={
                        settings[item.key as keyof PaperSettings] as boolean
                      }
                      disabled={(item as any).disabled}
                      onCheckedChange={(v) =>
                        updateSetting(item.key as keyof PaperSettings, v)
                      }
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Branding */}
            <AccordionItem
              value="branding"
              className="border rounded-xl bg-background px-3"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <Stamp className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="font-medium">ব্র্যান্ডিং</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  <ToggleItem
                    label="লোগো প্রদর্শন করুন"
                    checked={settings.showLogo}
                    onCheckedChange={(v) => updateSetting("showLogo", v)}
                    icon={<Circle className="w-4 h-4" />}
                  />

                  {settings.showLogo && (
                    <div className="space-y-2 px-1">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                        লোগো URL (অপশনাল)
                      </Label>
                      <Input
                        value={settings.logoUrl}
                        onChange={(e) =>
                          updateSetting("logoUrl", e.target.value)
                        }
                        placeholder="https://..."
                        className="h-9 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed my-2" />

                <div className="space-y-3">
                  <ToggleItem
                    label="ঠিকানা দেখান"
                    checked={settings.showAddress}
                    onCheckedChange={(v) => updateSetting("showAddress", v)}
                  />
                  {settings.showAddress && (
                    <Input
                      placeholder="প্রতিষ্ঠানের ঠিকানা লিখুন"
                      value={settings.address}
                      onChange={(e) => updateSetting("address", e.target.value)}
                      className="bg-background"
                    />
                  )}

                  <ToggleItem
                    label="জলছাপ দেখান"
                    checked={settings.showWatermark}
                    onCheckedChange={(v) => updateSetting("showWatermark", v)}
                  />
                  {settings.showWatermark && (
                    <Input
                      placeholder="জলছাপ টেক্সট লিখুন"
                      value={settings.watermark}
                      onChange={(e) =>
                        updateSetting("watermark", e.target.value)
                      }
                      className="bg-background"
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Typography */}
            <AccordionItem
              value="typography"
              className="border rounded-xl bg-background px-3"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10">
                    <Type className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="font-medium">টাইপোগ্রাফি</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Font Family */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    ফন্ট ফ্যামিলি
                  </Label>
                  <Select
                    value={settings.fontFamily}
                    onValueChange={(v) => updateSetting("fontFamily", v)}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="ফন্ট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>
                            {font.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    ফন্ট সাইজ
                  </Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateSetting(
                          "fontSize",
                          Math.max(10, settings.fontSize - 1),
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold">
                        {settings.fontSize}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        px
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateSetting(
                          "fontSize",
                          Math.min(24, settings.fontSize + 1),
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Quick size presets */}
                  <div className="flex gap-1">
                    {[12, 14, 16, 18, 20].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting("fontSize", size)}
                        className={cn(
                          "flex-1 py-1.5 rounded-md text-xs font-medium transition-colors",
                          settings.fontSize === size
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    লাইন হাইট
                  </Label>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateSetting(
                          "lineHeight",
                          Math.max(0.8, (settings.lineHeight || 1.1) - 0.1),
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold">
                        {(settings.lineHeight || 1.1).toFixed(1)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateSetting(
                          "lineHeight",
                          Math.min(2, (settings.lineHeight || 1.1) + 0.1),
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Quick presets */}
                  <div className="flex gap-1">
                    {[
                      { value: 1.0, label: "ঘন" },
                      { value: 1.2, label: "স্বাভাবিক" },
                      { value: 1.5, label: "শিথিল" },
                      { value: 1.8, label: "ফাঁকা" },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() =>
                          updateSetting("lineHeight", preset.value)
                        }
                        className={cn(
                          "flex-1 py-1.5 rounded-md text-xs font-medium transition-colors",
                          Math.abs(
                            (settings.lineHeight || 1.1) - preset.value,
                          ) < 0.05
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted",
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    ফন্ট ওয়েট
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <FontWeightCard
                      isSelected={settings.fontWeight === "normal"}
                      label="সাধারণ"
                      weightClass="font-normal"
                      onClick={() => updateSetting("fontWeight", "normal")}
                    />
                    <FontWeightCard
                      isSelected={settings.fontWeight === "medium"}
                      label="মাঝারি"
                      weightClass="font-medium"
                      onClick={() => updateSetting("fontWeight", "medium")}
                    />
                    <FontWeightCard
                      isSelected={settings.fontWeight === "semibold"}
                      label="সেমি বোল্ড"
                      weightClass="font-semibold"
                      onClick={() => updateSetting("fontWeight", "semibold")}
                    />
                    <FontWeightCard
                      isSelected={settings.fontWeight === "bold"}
                      label="বোল্ড"
                      weightClass="font-bold"
                      onClick={() => updateSetting("fontWeight", "bold")}
                    />
                  </div>
                </div>

                {/* Option Style */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    অপশন স্টাইল
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <OptionStyleCard
                      isSelected={settings.optionStyle === "parentheses"}
                      display="(ক)"
                      onClick={() =>
                        updateSetting("optionStyle", "parentheses")
                      }
                    />
                    <OptionStyleCard
                      isSelected={settings.optionStyle === "dot"}
                      display="ক."
                      onClick={() => updateSetting("optionStyle", "dot")}
                    />
                    <OptionStyleCard
                      isSelected={settings.optionStyle === "bracket"}
                      display="ক)"
                      onClick={() => updateSetting("optionStyle", "bracket")}
                    />
                    <OptionStyleCard
                      isSelected={settings.optionStyle === "round"}
                      display={
                        <span className="flex items-center gap-0.5">
                          <Circle className="w-2.5 h-2.5" />ক
                        </span>
                      }
                      onClick={() => updateSetting("optionStyle", "round")}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Shuffle & Tools */}
            <AccordionItem
              value="tools"
              className="border rounded-xl bg-background px-3"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <Shuffle className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="font-medium">শাফল ও টুলস</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <ToggleItem
                  label="প্রশ্ন শাফল করুন"
                  description="প্রশ্নের ক্রম এলোমেলো করে দেবে"
                  checked={settings.shuffleQuestions}
                  onCheckedChange={(v) => updateSetting("shuffleQuestions", v)}
                  icon={<Shuffle className="w-3.5 h-3.5" />}
                />
                <ToggleItem
                  label="অপশন শাফল করুন"
                  description="প্রতিটি প্রশ্নের অপশনগুলো এলোমেলো করে দেবে"
                  checked={settings.shuffleOptions}
                  onCheckedChange={(v) => updateSetting("shuffleOptions", v)}
                  icon={<Shuffle className="w-3.5 h-3.5" />}
                />
                <ToggleItem
                  label="পুনরাবৃত্ত প্রশ্ন শনাক্ত"
                  description="একই প্রশ্ন একাধিকবার নির্বাচিত হলে হাইলাইট করবে"
                  checked={settings.detectDuplicates}
                  onCheckedChange={(v) => updateSetting("detectDuplicates", v)}
                />
                <ToggleItem
                  label="সেট কোড তৈরী"
                  checked={settings.enableShuffle}
                  onCheckedChange={(v) => updateSetting("enableShuffle", v)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};
