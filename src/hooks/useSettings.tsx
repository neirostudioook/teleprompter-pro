"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface PrompterSettings {
    text: string;
    speed: number;
    fontSize: number;
    lineHeight: number;
    horizontalPadding: number;
    verticalPadding: number;
    mirrorHorizontal: boolean;
    mirrorVertical: boolean;
    showFocusMode: boolean;
    focusLines: number;
    textColor: string;
    backgroundColor: string;
    textAlign: "left" | "center" | "right" | "justify";
}

export const defaultSettings: PrompterSettings = {
    text: "Вставьте ваш текст сюда...\n\nИли начните печатать.\n\nТелесуфлёр готов к работе!",
    speed: 20, // arbitrary unit, mapped to pixels/sec
    fontSize: 60,
    lineHeight: 1.5,
    horizontalPadding: 15,
    verticalPadding: 20,
    mirrorHorizontal: false,
    mirrorVertical: false,
    showFocusMode: true,
    focusLines: 2,
    textColor: "#ffffff",
    backgroundColor: "#000000",
    textAlign: "center",
};

interface SettingsContextType {
    settings: PrompterSettings;
    updateSettings: (newSettings: Partial<PrompterSettings>) => void;
    resetSettings: () => void;
    wordsCount: number;
    durationSeconds: number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const [settings, setSettings] = useLocalStorage<PrompterSettings>("prompter-settings", defaultSettings);

    const updateSettings = (newSettings: Partial<PrompterSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const wordsCount = React.useMemo(() => {
        return settings.text.trim().split(/\s+/).filter(w => w.length > 0).length || 1;
    }, [settings.text]);

    const wpm = 60 + ((settings.speed - 1) * (240 / 99));
    const durationSeconds = (wordsCount / wpm) * 60;

    if (!isMounted) {
        return (
            <SettingsContext.Provider value={{ settings: defaultSettings, updateSettings, resetSettings, wordsCount: 1, durationSeconds: 0 }}>
                {children}
            </SettingsContext.Provider>
        );
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, wordsCount, durationSeconds }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
