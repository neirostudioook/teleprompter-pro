"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { usePrompterScroll } from "@/hooks/usePrompterScroll";
import { useDocumentPip } from "@/hooks/useDocumentPip";
import { PiPWindow } from "@/components/PiPWindow";
import { Maximize2, Play, Pause, RotateCcw } from "lucide-react";

export function PrompterView() {
    const { settings, durationSeconds } = useSettings();
    const [isPlaying, setIsPlaying] = useState(false);

    const [pixelsPerSecond, setPixelsPerSecond] = useState(0);

    const formatDuration = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        if (m > 0) {
            return `${m}м ${s}с`;
        }
        return `${s}с`;
    };

    const { scrollY, resetScroll, manualScroll, setScrollY } = usePrompterScroll(pixelsPerSecond, isPlaying);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const prevHeightRef = useRef<number>(0);
    const prevTextRef = useRef(settings.text);


    const { requestPip, closePip, isSupported, pipWindow } = useDocumentPip();

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const currentHeight = el.getBoundingClientRect().height;

        // Calculate needed speed to finish in durationSeconds
        if (durationSeconds > 0) {
            setPixelsPerSecond(currentHeight / durationSeconds);
        }

        if (prevHeightRef.current > 0 && currentHeight > 0 && prevTextRef.current === settings.text) {
            const ratio = currentHeight / prevHeightRef.current;
            if (Math.abs(ratio - 1) > 0.001) {
                setScrollY(prev => prev * ratio);
            }
        }

        prevHeightRef.current = currentHeight;
        prevTextRef.current = settings.text;
    });

    // Dispatch progress event for controls
    useEffect(() => {
        const elapsed = pixelsPerSecond > 0 ? Math.abs(scrollY) / pixelsPerSecond : 0;
        const remaining = pixelsPerSecond > 0 ? Math.max(0, durationSeconds - elapsed) : durationSeconds;

        const event = new CustomEvent('prompter-progress', {
            detail: { elapsed, remaining }
        });
        window.dispatchEvent(event);
    }, [scrollY, pixelsPerSecond, durationSeconds]);

    const handlePiP = async () => {
        try {
            await requestPip(400, 300);
        } catch (error) {
            console.error("PiP error:", error);
        }
    };

    // Handle keyboard shortcuts (Space to play/pause)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not typing in textarea or input
            if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") {
                return;
            }
            if (e.code === "Space") {
                e.preventDefault();
                setIsPlaying(p => !p);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Handle manual scroll via mouse wheel
    const handleWheel = (e: React.WheelEvent) => {
        manualScroll(e.deltaY);
    };

    const PrompterContent = (
        <div className="flex-1 w-full flex justify-center py-4 relative group/pip">
            {/* Container inside */}
            <div
                className="flex-1 w-full flex justify-center relative cursor-ns-resize"
                onWheel={handleWheel}
                onClick={() => setIsPlaying(!isPlaying)}
            >
                <div
                    className="w-full relative h-full flex flex-col items-center"
                    style={{
                        paddingLeft: `${settings.horizontalPadding}% `,
                        paddingRight: `${settings.horizontalPadding}% `,
                    }}
                >
                    {/* Focus indicator lines */}
                    {settings.showFocusMode && (
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[180px] pointer-events-none 
                            border-y-2 border-yellow-500/30 bg-yellow-500/5 z-20">
                            <div className="absolute top-1/2 left-0 w-8 h-[2px] bg-yellow-500/80 -translate-y-1/2 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                            <div className="absolute top-1/2 right-0 w-8 h-[2px] bg-yellow-500/80 -translate-y-1/2 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                        </div>
                    )}

                    {/* Text Container */}
                    <div
                        ref={containerRef}
                        className="w-full h-full overflow-hidden relative"
                        style={{
                            color: settings.textColor,
                            backgroundColor: settings.backgroundColor,
                            textAlign: settings.textAlign,
                            transform: `${settings.mirrorHorizontal ? 'scaleX(-1)' : ''} ${settings.mirrorVertical ? 'scaleY(-1)' : ''} `,
                        }}
                    >
                        <div
                            className="w-full h-full relative pointer-events-none"
                            style={settings.showFocusMode ? {
                                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 30%, black 40%, black 60%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.35) 100%)',
                                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 30%, black 40%, black 60%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.35) 100%)',
                            } : {}}
                        >
                            <div
                                ref={textRef}
                                style={{
                                    fontSize: `clamp(20px, ${settings.fontSize * 0.5}px + 1vw, ${settings.fontSize}px)`,
                                    lineHeight: settings.lineHeight,
                                    transform: `translateY(${scrollY}px)`,
                                }}
                                className="whitespace-pre-wrap break-words font-sans absolute top-[50%] left-0 right-0 px-4 sm:px-8 pb-[100vh] pointer-events-auto"
                            >
                                {settings.text}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Big Play Overlay when paused */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity">
                    <div className="w-16 h-16 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse border border-white/20">
                        <Play className="w-8 h-8 text-white/70 ml-1.5" />
                    </div>
                </div>
            )}

            {/* Floating Play Controls overlay strictly for the prompter testing */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-30 transition-all duration-500 ${isPlaying ? 'opacity-20 hover:opacity-100' : 'opacity-100 hover:scale-105'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); resetScroll(); setIsPlaying(false); }}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all leading-none"
                    title="В начало"
                >
                    <RotateCcw className="w-4 h-4 flex-shrink-0" />
                </button>
                <div className="w-px h-6 bg-white/20"></div>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                    className="p-2 bg-white/10 hover:bg-blue-600 text-white hover:text-white rounded-full flex items-center justify-center transition-all leading-none shadow-lg"
                    title={isPlaying ? "Пауза" : "Старт"}
                >
                    {isPlaying ? <Pause className="w-5 h-5 flex-shrink-0" /> : <Play className="w-5 h-5 ml-0.5 flex-shrink-0" />}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className={`relative flex-1 bg-black flex flex-col overflow-hidden group ${pipWindow ? 'hidden' : ''} `}>
                {/* Top Bar Overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex justify-between items-center z-[100] transition-opacity duration-300 pointer-events-none opacity-0 group-hover:opacity-100">
                    <div className="text-white/30 text-xs sm:text-sm font-medium bg-black/30 px-2 sm:px-3 py-1 rounded-full pointer-events-auto border border-white/5">Предпросмотр</div>
                    {isSupported && (
                        <button
                            id="pip-btn"
                            onClick={handlePiP}
                            className="bg-black/20 hover:bg-white/10 text-white/50 hover:text-white/90 rounded-full px-3 py-1.5 flex items-center gap-2 transition-colors ml-auto backdrop-blur-md border border-white/5 text-xs sm:text-sm pointer-events-auto shadow-lg"
                            title="Мини-окно (PiP)"
                        >
                            <Maximize2 className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">Mini</span>
                        </button>
                    )}
                </div>

                {PrompterContent}
            </div>

            <PiPWindow pipWindow={pipWindow} closePip={closePip}>
                {PrompterContent}
            </PiPWindow>
        </>
    );
}
