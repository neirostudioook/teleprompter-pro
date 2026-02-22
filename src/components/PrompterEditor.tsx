"use client";

import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { Textarea } from "@/components/ui/textarea";
import { Maximize2 } from "lucide-react";

export function PrompterEditor() {
    const { settings, updateSettings } = useSettings();

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
            <Textarea
                value={settings.text}
                onChange={(e) => updateSettings({ text: e.target.value })}
                className="flex-1 resize-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 p-6 text-base leading-relaxed focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl shadow-inner transition-shadow hover:shadow-md"
                placeholder="Введите текст для телесуфлера..."
            />
        </div>
    );
}
