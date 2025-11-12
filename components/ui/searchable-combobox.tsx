"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";
import clsx from "clsx";

export interface SearchableOption {
  label: string;
  value: string;
}

interface SearchableComboboxProps {
  name?: string;
  value: string;
  options: SearchableOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  allowCustomValue?: boolean; // boleh ketik value yang belum ada
  emptyLabel?: string;
  disabled?: boolean;
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

// Lightweight searchable + typeable combobox (headless, Tailwind styled)
export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  name,
  value,
  options,
  placeholder = "Ketik atau pilih...",
  onChange,
  allowCustomValue = true,
  emptyLabel = "Tidak ada hasil",
  disabled = false,
  className,
  onBlur,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number; width: number; openUp: boolean }>({ left: 0, top: 0, width: 0, openUp: false });

  const computePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const estimatedHeight = 260; // px
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight;
    const top = openUp ? rect.top : rect.bottom;
    setDropdownPos({ left: rect.left, top, width: rect.width, openUp });
  };

  // Filter options berdasarkan query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
  }, [query, options]);

  // Tutup jika klik luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reposition on open/resize/scroll
  useEffect(() => {
    if (!open) return;
    computePosition();
    const onResize = () => computePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  // Sync query ketika value berubah (agar menampilkan label terpilih)
  useEffect(() => {
    const selected = options.find(o => o.value === value);
    if (selected) setQuery(selected.label);
    else if (allowCustomValue) setQuery(value || "");
  }, [value, options, allowCustomValue]);

  const handleSelect = (val: string, label?: string) => {
    onChange(val);
    // Setelah memilih, tampilkan labelnya
    if (label) setQuery(label); else setQuery(val);
    setOpen(false);
  };

  const showClear = value.length > 0;

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <div
        className={clsx(
          "flex items-center gap-2 w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm focus-within:ring-2 focus-within:ring-purple-500 transition", 
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (allowCustomValue) onChange(e.target.value); // value mengikuti teks jika custom
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
        {showClear && (
          <button
            type="button"
            onClick={() => { setQuery(""); onChange(""); }}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
            onClick={() => setOpen(o => !o)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          aria-label="Toggle"
        >
          <ChevronDown className={clsx("w-4 h-4 transition", open && "rotate-180")}/>
        </button>
      </div>

      {open && createPortal(
        <div
          className="z-[1000] max-h-60 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg animate-in fade-in"
          style={{ position: "fixed", left: dropdownPos.left, top: dropdownPos.top, width: dropdownPos.width, transform: dropdownPos.openUp ? "translateY(-100%)" : undefined }}
        >
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{emptyLabel}</div>
          )}
          {filtered.map(opt => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value, opt.label)}
                className={clsx(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-gray-700", 
                  selected && "bg-purple-100 dark:bg-gray-700/60 font-semibold"
                )}
              >
                <span className="flex-1 text-gray-700 dark:text-gray-200">{opt.label}</span>
                {selected && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            );
          })}
          {allowCustomValue && query && !options.some(o => o.value.toLowerCase() === query.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleSelect(query)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
            >
              Tambah &quot;{query}&quot; sebagai nilai baru
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchableCombobox;