"use client";

import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Type,
    MoveVertical,
    Maximize2,
    FlipHorizontal,
    FlipVertical,
    MonitorPlay,
    Play,
    Settings2,
    Minimize2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify
} from "lucide-react";

export function PrompterControls() {
    const { settings, updateSettings, durationSeconds } = useSettings();
    const [timeProgress, setTimeProgress] = React.useState({ elapsed: 0, remaining: durationSeconds });

    React.useEffect(() => {
        setTimeProgress(prev => ({ ...prev, remaining: Math.max(0, durationSeconds - prev.elapsed) }));
    }, [durationSeconds]);

    React.useEffect(() => {
        const handler = (e: any) => {
            const { elapsed, remaining } = e.detail;
            setTimeProgress(prev => {
                if (Math.abs(prev.elapsed - elapsed) >= 0.5 || Math.abs(prev.remaining - remaining) >= 0.5) {
                    return { elapsed, remaining };
                }
                return prev;
            });
        };
        window.addEventListener('prompter-progress', handler);
        return () => window.removeEventListener('prompter-progress', handler);
    }, []);

    const formatDuration = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        if (m > 0) {
            return `${m}м ${s}с`;
        }
        return `${s}с`;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto w-full shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Настройки
                </h2>
            </div>

            {/* Info Panel */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Прошло</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{formatDuration(timeProgress.elapsed)}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Осталось</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{formatDuration(timeProgress.remaining)}</div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Speed & Text */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Play className="w-4 h-4" />
                                Скорость
                            </Label>
                            <span className="text-sm font-medium">{settings.speed}</span>
                        </div>
                        <Slider
                            value={[settings.speed]}
                            min={1}
                            max={100}
                            step={1}
                            onValueChange={([val]) => updateSettings({ speed: val })}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Type className="w-4 h-4" />
                                Размер шрифта
                            </Label>
                            <span className="text-sm font-medium">{settings.fontSize}px</span>
                        </div>
                        <Slider
                            value={[settings.fontSize]}
                            min={24}
                            max={150}
                            step={2}
                            onValueChange={([val]) => updateSettings({ fontSize: val })}
                            className="py-2"
                        />
                    </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-800" />

                {/* Layout */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                        Отображение
                    </h3>

                    {/* Colors & Alignment */}
                    <div className="space-y-3">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Цветовая схема</Label>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button onClick={() => updateSettings({ textColor: "#ffffff", backgroundColor: "#000000" })} className={`py-2 rounded-lg text-sm font-medium border ${settings.backgroundColor === "#000000" && settings.textColor === "#ffffff" ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 dark:border-slate-800"} bg-black text-white transition-all`}>Тёмная</button>
                            <button onClick={() => updateSettings({ textColor: "#000000", backgroundColor: "#ffffff" })} className={`py-2 rounded-lg text-sm font-medium border ${settings.backgroundColor === "#ffffff" ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 dark:border-slate-800"} bg-white text-black transition-all shadow-sm`}>Светлая</button>
                            <button onClick={() => updateSettings({ textColor: "#fcd34d", backgroundColor: "#000000" })} className={`py-2 rounded-lg text-sm font-medium border ${settings.textColor === "#fcd34d" ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 dark:border-slate-800"} bg-black text-amber-300 transition-all`}>Жёлтая</button>
                            <button onClick={() => updateSettings({ textColor: "#ffffff", backgroundColor: "#00ff00" })} className={`py-2 rounded-lg text-sm font-medium border ${settings.backgroundColor === "#00ff00" ? "ring-2 ring-blue-500 border-transparent" : "border-slate-200 dark:border-slate-800"} bg-green-500 text-white transition-all`}>Хромакей</button>
                        </div>

                        <div className="flex gap-4">
                            <div className="space-y-1.5 flex-1">
                                <Label className="text-xs text-slate-500">Текст</Label>
                                <div className="flex h-9 w-full items-center rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                                    <input type="color" value={settings.textColor} onChange={(e) => updateSettings({ textColor: e.target.value })} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0 flex-shrink-0" />
                                    <span className="ml-2 font-mono text-xs">{settings.textColor}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <Label className="text-xs text-slate-500">Фон</Label>
                                <div className="flex h-9 w-full items-center rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                                    <input type="color" value={settings.backgroundColor} onChange={(e) => updateSettings({ backgroundColor: e.target.value })} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0 flex-shrink-0" />
                                    <span className="ml-2 font-mono text-xs">{settings.backgroundColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Label className="text-xs text-slate-500 uppercase tracking-wider">Выравнивание текста</Label>
                        <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                            <button onClick={() => updateSettings({ textAlign: "left" })} className={`flex items-center justify-center py-2 rounded-md transition-all ${settings.textAlign === "left" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-500" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}><AlignLeft className="w-4 h-4" /></button>
                            <button onClick={() => updateSettings({ textAlign: "center" })} className={`flex items-center justify-center py-2 rounded-md transition-all ${settings.textAlign === "center" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-500" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}><AlignCenter className="w-4 h-4" /></button>
                            <button onClick={() => updateSettings({ textAlign: "right" })} className={`flex items-center justify-center py-2 rounded-md transition-all ${settings.textAlign === "right" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-500" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}><AlignRight className="w-4 h-4" /></button>
                            <button onClick={() => updateSettings({ textAlign: "justify" })} className={`flex items-center justify-center py-2 rounded-md transition-all ${settings.textAlign === "justify" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-500" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}><AlignJustify className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <MoveVertical className="w-4 h-4" />
                                Высота строки (Line Height)
                            </Label>
                            <span className="text-sm font-medium">{settings.lineHeight}x</span>
                        </div>
                        <Slider
                            value={[settings.lineHeight]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={([val]) => updateSettings({ lineHeight: val })}
                            className="py-2"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Maximize2 className="w-4 h-4" />
                                Ширина текста (Отступы)
                            </Label>
                            <span className="text-sm font-medium">{settings.horizontalPadding}%</span>
                        </div>
                        <Slider
                            value={[settings.horizontalPadding]}
                            min={0}
                            max={40}
                            step={1}
                            onValueChange={([val]) => updateSettings({ horizontalPadding: val })}
                            className="py-2"
                        />
                    </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-800" />

                {/* Pro features */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                        Продвинутые
                    </h3>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="focus-mode" className="flex flex-col gap-1 cursor-pointer">
                            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <MonitorPlay className="w-4 h-4" />
                                Focus Mode (Фокус)
                            </span>
                            <span className="text-xs text-slate-500 font-normal">Затемнять неактивный текст</span>
                        </Label>
                        <Switch
                            id="focus-mode"
                            checked={settings.showFocusMode}
                            onCheckedChange={(val) => updateSettings({ showFocusMode: val })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="mirror-h" className="flex flex-col gap-1 cursor-pointer">
                            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <FlipHorizontal className="w-4 h-4" />
                                Зеркально (X)
                            </span>
                        </Label>
                        <Switch
                            id="mirror-h"
                            checked={settings.mirrorHorizontal}
                            onCheckedChange={(val) => updateSettings({ mirrorHorizontal: val })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="mirror-v" className="flex flex-col gap-1 cursor-pointer">
                            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <FlipVertical className="w-4 h-4" />
                                Зеркально (Y)
                            </span>
                        </Label>
                        <Switch
                            id="mirror-v"
                            checked={settings.mirrorVertical}
                            onCheckedChange={(val) => updateSettings({ mirrorVertical: val })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
