import { html } from '@grainular/nord';
import { Logo } from './logo.js';

export const App = () => {
    return html`
        <div
            class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.135_0.008_250)] text-[oklch(0.94_0.003_250)]"
        >
            <div
                class="absolute -top-[15%] left-[12%] h-[520px] w-[520px] animate-[drift-a_16s_ease-in-out_infinite] rounded-full bg-[#18bff1] opacity-20 blur-[110px]"
            ></div>
            <div
                class="absolute -bottom-[20%] right-[10%] h-[560px] w-[560px] animate-[drift-b_18s_ease-in-out_infinite] rounded-full bg-[#6b36d4] opacity-20 blur-[120px]"
            ></div>

            <div class="relative z-10 flex flex-col items-center gap-7">
                ${Logo()}

                <p class="m-0 flex items-center gap-2.5 font-mono text-[15px] text-[oklch(0.7_0.012_250)]">
                    <span class="text-[oklch(0.59_0.014_250)]">$</span>
                    edit
                    <span class="text-[oklch(0.94_0.003_250)]">src/app.js</span>
                    to get started
                    <span
                        class="inline-block h-4 w-2 animate-[cursor-blink_1s_step-end_infinite] bg-[oklch(0.7_0.19_255)]"
                    ></span>
                </p>

                <div class="mt-1 flex gap-7">
                    <a
                        class="font-mono text-[13px] tracking-wide text-[oklch(0.7_0.19_255/0.85)] hover:text-[oklch(0.7_0.19_255)]"
                        href="https://nordjs.dev"
                        target="_blank"
                        rel="noreferrer"
                        >docs</a
                    >
                    <a
                        class="font-mono text-[13px] tracking-wide text-[oklch(0.7_0.19_255/0.85)] hover:text-[oklch(0.7_0.19_255)]"
                        href="https://github.com/grainular/nord"
                        target="_blank"
                        rel="noreferrer"
                        >github</a
                    >
                </div>
            </div>
        </div>
    `;
};
