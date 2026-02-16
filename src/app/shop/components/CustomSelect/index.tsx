"use client";

import React, { useEffect, useState, useRef } from "react";

import {
  CustomSelectRoot,
  CustomSelectTrigger,
  CustomSelectList,
  CustomSelectItem,
  OptionWrapper,
  OptionRow,
  ExpandButton,
} from "@ui";
import { Category } from "@models";

export const CustomSelect: React.FC<{
  value: string | null;
  options: Category[];
  placeholder?: string;
  onChange: (v: string | null) => void;
}> = ({ value, options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [expandedLocal, setExpandedLocal] = useState<Record<string, boolean>>(
    {},
  );
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.id === value);

  const buildMap = (items: Category[]) => {
    const map = new Map<string | null, Category[]>();
    items.forEach((it) => {
      const arr = map.get(it.parentId) || [];
      arr.push(it);
      map.set(it.parentId, arr);
    });
    return map;
  };

  const childrenMap = buildMap(options);

  const toggleLocal = (id: string) => {
    setExpandedLocal((s) => ({ ...s, [id]: !s[id] }));
  };

  const renderOptionNode = (node: Category, level = 0) => {
    const children = childrenMap.get(node.id) || [];
    const isOpen = !!expandedLocal[node.id];
    return (
      <OptionWrapper key={node.id}>
        <OptionRow
          $level={level}
          onClick={() => {
            onChange(node.id);
            setOpen(false);
          }}
        >
          <span>{node.name}</span>
          {children.length ? (
            <ExpandButton
              onClick={(e) => {
                e.stopPropagation();
                toggleLocal(node.id);
              }}
              $isOpen={isOpen}
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? "▾" : "▸"}
            </ExpandButton>
          ) : null}
        </OptionRow>
        {isOpen && children.map((c) => renderOptionNode(c, level + 1))}
      </OptionWrapper>
    );
  };

  return (
    <CustomSelectRoot ref={ref}>
      <CustomSelectTrigger
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        style={{ cursor: open ? "zoom-out" : "zoom-in" }}
      >
        <span>{selected ? selected.name : (placeholder ?? "Select")}</span>
        <span>{open ? "▴" : "▾"}</span>
      </CustomSelectTrigger>
      {open && (
        <CustomSelectList>
          <CustomSelectItem
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            (no category)
          </CustomSelectItem>
          {(childrenMap.get(null) || []).map((root) =>
            renderOptionNode(root, 0),
          )}
        </CustomSelectList>
      )}
    </CustomSelectRoot>
  );
};

export default CustomSelect;
