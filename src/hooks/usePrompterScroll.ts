"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function usePrompterScroll(speed: number, isPlaying: boolean) {
    const [scrollY, setScrollY] = useState(0);
    const requestRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number | undefined>(undefined);

    const animate = useCallback(
        (time: number) => {
            if (lastTimeRef.current != undefined) {
                const deltaTime = time - lastTimeRef.current;
                const deltaScroll = (speed * deltaTime) / 1000;

                setScrollY((prev) => prev - deltaScroll);
            }
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        },
        [speed]
    );

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            lastTimeRef.current = undefined; // Reset last time when paused
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, animate]);

    const resetScroll = useCallback(() => {
        setScrollY(0);
    }, []);

    const manualScroll = useCallback((deltaY: number) => {
        setScrollY((prev) => prev - deltaY);
    }, []);

    return { scrollY, resetScroll, manualScroll, setScrollY };
}
