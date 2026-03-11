"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import { usePreview } from "./preview-context";
import { toBengaliDigits, toEnglishDigits } from "./preview-utils";
import { ElementStyle, HeaderStyles } from "../types";

const editableBaseClass = "transition-all duration-200 rounded px-1 -mx-1";
const editableHoverClass =
  "hover:bg-primary/10 hover:ring-1 hover:ring-primary/30";
const editableFocusClass =
  "focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:outline-none";

interface HeaderEditableProps {
  value: string;
  onChange: (value: string) => void;
  style: ElementStyle;
  isEditing: boolean;
  field: keyof HeaderStyles;
  as?: "input" | "textarea";
  placeholder?: string;
  className?: string;
}

const HeaderEditable: React.FC<HeaderEditableProps> = ({
  value,
  onChange,
  style,
  isEditing,
  field,
  as = "input",
  placeholder,
  className,
}) => {
  const { handleHeaderFocus, handleBlur } = usePreview();
  const isCentered =
    style.textAlign === "center" || style.textAlign === undefined;
  const inlineStyle = {
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    textAlign: style.textAlign as React.CSSProperties["textAlign"],
  };

  if (!isEditing) {
    return (
      <span
        className={cn(className, isCentered && "block w-full")}
        style={inlineStyle}
      >
        {value}
      </span>
    );
  }

  const inputClasses = cn(
    "bg-transparent border-0 p-0 px-0.5 focus:ring-0 text-[inherit]",
    as === "textarea" || isCentered || className?.includes("w-full")
      ? "w-full block"
      : "w-auto min-w-[20px] inline-block",
    isCentered && "text-center",
    editableBaseClass,
    editableHoverClass,
    editableFocusClass,
    className,
  );

  if (as === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => handleHeaderFocus(e, field)}
        onBlur={handleBlur}
        className={cn(
          inputClasses,
          "resize-none min-h-[1.5em] overflow-hidden",
        )}
        style={inlineStyle}
        placeholder={placeholder}
        rows={1}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => handleHeaderFocus(e, field)}
      onBlur={handleBlur}
      className={inputClasses}
      style={{
        ...inlineStyle,
        width:
          !isCentered && !className?.includes("w-full")
            ? `${Math.max(value.length * 1.8 + 0.5, 2)}ch`
            : "100%",
      }}
      placeholder={placeholder}
    />
  );
};

export const PaperHeader: React.FC = () => {
  const { settings, isEditing, updateSetting, getHeaderStyle, subjects } =
    usePreview();

  return (
    <div className="relative mb-2" style={{ breakInside: "avoid" }}>
      <div className="flex flex-col items-center justify-center relative mb-1">
        {settings.showLogo && (
          <div className="absolute left-0 top-0 pt-2">
            {settings.logoUrl && !settings.logoUrl.includes("placeholder") ? (
              <Image
                src={settings.logoUrl}
                alt="Logo"
                width={70}
                height={70}
                className="max-w-[70px] max-h-[70px] object-contain"
              />
            ) : (
              <div className="w-16 h-16 border border-dashed border-muted-foreground/30 flex items-center justify-center rounded bg-muted/10">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">
                  Logo
                </span>
              </div>
            )}
          </div>
        )}

        {settings.showSetCode && (
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <span className="text-sm font-medium">সেট :</span>
            <div className="border-[1px] border-black flex items-center justify-center font-bold rounded-none w-6 h-6 overflow-visible">
              <span
                className="text-center font-bold"
                style={{
                  fontSize: getHeaderStyle("setCode").fontSize,
                  fontFamily: getHeaderStyle("setCode").fontFamily,
                }}
              >
                {settings.setCode || "ক"}
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-1">
          <HeaderEditable
            value={settings.institutionName}
            onChange={(v) => updateSetting("institutionName", v)}
            field="institutionName"
            style={getHeaderStyle("institutionName")}
            isEditing={isEditing}
            className="font-bold block leading-tight text-xl mb-1"
            placeholder="প্রতিষ্ঠানের নাম"
          />

          {settings.showExamName && (
            <HeaderEditable
              value={settings.examName}
              onChange={(v) => updateSetting("examName", v)}
              field="examName"
              style={getHeaderStyle("examName")}
              isEditing={isEditing}
              className="font-bold block leading-tight text-lg"
              placeholder="পরীক্ষার নাম"
            />
          )}

          {settings.showClassName && (
            <HeaderEditable
              value={settings.className}
              onChange={(v) => updateSetting("className", v)}
              field="className"
              style={getHeaderStyle("className")}
              isEditing={isEditing}
              className="block font-medium"
              placeholder="শ্রেণি"
            />
          )}

          {settings.showSubjectName && (!subjects || subjects.length <= 1) && (
            <HeaderEditable
              value={settings.subjectName}
              onChange={(v) => updateSetting("subjectName", v)}
              field="subjectName"
              style={getHeaderStyle("subjectName")}
              isEditing={isEditing}
              className="block font-medium"
              placeholder="বিষয়ের নাম"
            />
          )}

          {settings.showChapterName && (
            <HeaderEditable
              value={settings.chapterName}
              onChange={(v) => updateSetting("chapterName", v)}
              field="chapterName"
              style={getHeaderStyle("chapterName")}
              isEditing={isEditing}
              className="block"
              placeholder="অধ্যায়ের নাম"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center py-1 mt-1 mb-0 px-1 text-sm">
        {settings.showTime ? (
          <div className="flex items-center whitespace-nowrap">
            <span className="font-bold mr-1">সময় —</span>
            <HeaderEditable
              value={settings.time}
              onChange={(v) => updateSetting("time", v)}
              field="time"
              style={getHeaderStyle("time")}
              isEditing={isEditing}
              placeholder="সময়"
            />
          </div>
        ) : (
          <div />
        )}

        {settings.showTotalMarks ? (
          <div className="flex items-center whitespace-nowrap text-right">
            <span className="font-bold mr-1">পূর্ণমান —</span>
            <HeaderEditable
              value={toBengaliDigits(settings.totalMarks)}
              onChange={(v) =>
                updateSetting("totalMarks", parseInt(toEnglishDigits(v)) || 0)
              }
              field="totalMarks"
              style={getHeaderStyle("totalMarks")}
              isEditing={isEditing}
              placeholder="পূর্ণমান"
            />
          </div>
        ) : (
          <div />
        )}
      </div>

      {settings.showInstructions && (
        <div className="mb-0 px-1 text-sm border-t border-dashed border-black pt-1 mt-0">
          <HeaderEditable
            value={settings.instructions}
            onChange={(v) => updateSetting("instructions", v)}
            field="instructions"
            style={getHeaderStyle("instructions")}
            isEditing={isEditing}
            as="textarea"
            className="w-full leading-relaxed"
            placeholder="নির্দেশনা লিখুন..."
          />
        </div>
      )}

      {settings.showNoMarkingNote && (
        <div className="text-center mt-0 mb-1">
          <p className="text-[13px] font-bold inline-block px-4">
            প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
          </p>
        </div>
      )}
    </div>
  );
};
