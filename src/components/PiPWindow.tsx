"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PiPWindowProps {
    children: React.ReactNode;
    pipWindow: Window | null;
    closePip: () => void;
}

export function PiPWindow({ children, pipWindow, closePip }: PiPWindowProps) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (pipWindow) {
            const div = pipWindow.document.createElement("div");
            div.className = "flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900";

            pipWindow.document.body.appendChild(div);
            pipWindow.document.body.style.margin = "0";
            pipWindow.document.body.style.padding = "0";
            pipWindow.document.body.style.overflow = "hidden";

            setContainer(div);

            return () => {
                if (pipWindow.document.body.contains(div)) {
                    pipWindow.document.body.removeChild(div);
                }
                setContainer(null);
            };
        } else {
            setContainer(null);
        }
    }, [pipWindow]);

    if (pipWindow && container) {
        return createPortal(
            <div className="flex-1 h-full w-full bg-black relative flex flex-col">
                {children}
            </div>,
            container
        );
    }

    return null;
}
