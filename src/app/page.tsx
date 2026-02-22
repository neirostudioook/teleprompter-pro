import React from "react";
import { SettingsProvider } from "@/hooks/useSettings";
import { PrompterEditor } from "@/components/PrompterEditor";
import { PrompterControls } from "@/components/PrompterControls";
import { PrompterView } from "@/components/PrompterView";

export default function Home() {
  return (
    <SettingsProvider>
      <main className="flex flex-col lg:flex-row min-h-[100dvh] lg:h-[100dvh] w-full bg-slate-100 overflow-y-auto lg:overflow-hidden font-sans text-slate-900">

        {/* Left Sidebar - Editor */}
        <aside className="w-full lg:w-[400px] shrink-0 h-[40vh] lg:h-full shadow-lg z-10 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 order-1 lg:order-none">
          <div className="bg-blue-600 dark:bg-blue-900 text-white p-4 shrink-0 shadow-sm border-b border-blue-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xl shadow-inner">T</div>
            <h1 className="text-xl font-bold tracking-tight">Teleprompter Pro</h1>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col h-full">
            <PrompterEditor />
          </div>
        </aside>

        {/* Main Content - Preview Window */}
        <section className="flex-1 min-h-[50vh] lg:h-full w-full relative z-0 flex flex-col pt-0 pb-0 shadow-inner order-2 lg:order-none">
          <PrompterView />
        </section>

        {/* Right Sidebar - Settings */}
        <aside className="w-full lg:w-80 shrink-0 lg:h-full shadow-xl z-20 order-3 lg:order-none bg-white dark:bg-slate-950">
          <PrompterControls />
        </aside>

      </main>
    </SettingsProvider>
  );
}
