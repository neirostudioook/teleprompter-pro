"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { Textarea } from "@/components/ui/textarea";
import { Maximize2 } from "lucide-react";

export function PrompterEditor() {
    const { settings, updateSettings } = useSettings();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [isPlayingProgress, setIsPlayingProgress] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            const { elapsed, remaining } = e.detail;
            const total = elapsed + remaining;

            if (total > 0) {
                setProgress(elapsed / total);
                setIsPlayingProgress(elapsed > 0 && remaining > 0);
            } else {
                setIsPlayingProgress(false);
            }
        };
        window.addEventListener('prompter-progress', handler);
        return () => window.removeEventListener('prompter-progress', handler);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (backdropRef.current) {
            backdropRef.current.scrollTop = e.currentTarget.scrollTop;
            backdropRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    // Calculate highlighting based on progress
    const textLen = settings.text.length;

    // Instead of raw index, we might want to highlight a sliding window of text
    // We highlight roughly where the user should be reading
    const charsPerScreen = 300; // Expected chars visible on prompter screen
    const centerIndex = Math.floor(textLen * progress);

    // Smooth the highlight chunk
    const highlightLength = 100;
    const start = Math.max(0, centerIndex - highlightLength / 2);
    const end = Math.min(textLen, centerIndex + highlightLength / 2);

    const before = settings.text.substring(0, start);
    const highlight = settings.text.substring(start, end);
    const after = settings.text.substring(end);

    // Auto-scroll the backdrop to keep highlight in center
    useEffect(() => {
        if (backdropRef.current && textareaRef.current && isPlayingProgress) {
            // Rough estimation of scroll position based on progress
            const scrollHeight = textareaRef.current.scrollHeight;
            const clientHeight = textareaRef.current.clientHeight;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);

            // Only auto-scroll if progress is actually updating
            const targetScroll = maxScroll * progress;

            // Apply to both to keep them synced
            backdropRef.current.scrollTop = targetScroll;
            textareaRef.current.scrollTop = targetScroll;
        }
    }, [progress]);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Текст скрипта
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => document.getElementById('pip-btn')?.click()}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                        title="Открыть суфлер в мини-окне поверх всех окон"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        В мини-окно
                    </button>
                    <span className="text-xs font-medium text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-md hidden sm:inline-block">
                        Автосохранение
                    </span>
                </div>
            </div>
            <div className="relative flex-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner transition-shadow hover:shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                {/* Backdrop for highlighting */}
                <div
                    ref={backdropRef}
                    className="absolute inset-0 p-6 text-base leading-relaxed whitespace-pre-wrap break-words overflow-y-auto pointer-events-none z-0 scrollbar-hide"
                    style={{ color: "transparent", fontVariantLigatures: "none" }}
                    aria-hidden="true"
                >
                    {before}
                    <mark className="bg-blue-200/50 dark:bg-blue-600/30 text-transparent rounded px-1 -mx-1 transition-all duration-300">{highlight}</mark>
                    {after}
                    {/* Add extra padding at the bottom so it can scroll fully */}
                    <div className="h-10"></div>
                </div>

                <Textarea
                    ref={textareaRef}
                    onScroll={handleScroll}
                    value={settings.text}
                    onChange={(e) => updateSettings({ text: e.target.value })}
                    className="absolute inset-0 w-full h-full resize-none bg-transparent border-none p-6 text-base leading-relaxed focus-visible:ring-0 z-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 overflow-y-auto"
                    style={{ fontVariantLigatures: "none" }}
                    placeholder="Введите текст для телесуфлера..."
                />
            </div>
        </div>
    );
}
