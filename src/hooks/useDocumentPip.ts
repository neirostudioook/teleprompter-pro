"use client";

import { useState, useEffect, useCallback } from "react";

// Add TypeScript support for Document Picture-in-Picture API
declare global {
    interface Window {
        documentPictureInPicture?: {
            requestWindow(options?: any): Promise<Window>;
            window: Window | null;
        };
    }
}

export function useDocumentPip() {
    const [isSupported, setIsSupported] = useState(false);
    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "documentPictureInPicture" in window) {
            setIsSupported(true);
        }
    }, []);

    const requestPip = useCallback(async (width = 400, height = 300) => {
        if (!isSupported || !window.documentPictureInPicture) {
            console.warn("Document Picture-in-Picture API is not supported.");
            return null;
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width,
                height,
            });

            // Попытка центрировать окно (чуть выше центра)
            try {
                setTimeout(() => {
                    const screenW = window.screen.width;
                    const screenH = window.screen.height;
                    const left = Math.max(0, (screenW - width) / 2);
                    const top = Math.max(0, (screenH - height) / 2 - 100);
                    pip.moveTo(left, top);
                }, 50);
            } catch (moveError) {
                console.warn("Браузер заблокировал перемещение окна PiP:", moveError);
            }

            // Copy styles
            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach((sheet) => {
                try {
                    if (sheet.href) {
                        const newLink = pip.document.createElement("link");
                        newLink.rel = "stylesheet";
                        newLink.href = sheet.href;
                        pip.document.head.appendChild(newLink);
                    } else {
                        const rules = Array.from(sheet.cssRules)
                            .map((rule) => rule.cssText)
                            .join("");
                        const style = pip.document.createElement("style");
                        style.textContent = rules;
                        pip.document.head.appendChild(style);
                    }
                } catch (e) {
                    console.warn("Error copying stylesheet to PiP window:", e);
                }
            });

            setPipWindow(pip);

            pip.addEventListener("pagehide", () => {
                setPipWindow(null);
            });

            return pip;
        } catch (error) {
            console.error("Failed to enter PiP mode:", error);
            return null;
        }
    }, [isSupported]);

    const closePip = useCallback(() => {
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
        }
    }, [pipWindow]);

    return { isSupported, pipWindow, requestPip, closePip };
}
