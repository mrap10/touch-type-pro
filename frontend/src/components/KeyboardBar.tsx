import clsx from "clsx";

const KEYBOARD_LAYOUT = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m"],
    [" "],
];

const DEV_KEYBOARD_LAYOUT = [
    [
        { base: "1", shift: "!" },
        { base: "2", shift: "@" },
        { base: "3", shift: "#" },
        { base: "4", shift: "$" },
        { base: "5", shift: "%" },
        { base: "6", shift: "^" },
        { base: "7", shift: "&" },
        { base: "8", shift: "*" },
        { base: "9", shift: "(" },
        { base: "0", shift: ")" },
        { base: "-", shift: "_" },
        { base: "=", shift: "+" },
    ],
    [
        { base: "q", shift: "Q" },
        { base: "w", shift: "W" },
        { base: "e", shift: "E" },
        { base: "r", shift: "R" },
        { base: "t", shift: "T" },
        { base: "y", shift: "Y" },
        { base: "u", shift: "U" },
        { base: "i", shift: "I" },
        { base: "o", shift: "O" },
        { base: "p", shift: "P" },
        { base: "[", shift: "{" },
        { base: "]", shift: "}" },
        { base: "\\", shift: "|" },
    ],
    [
        { base: "a", shift: "A" },
        { base: "s", shift: "S" },
        { base: "d", shift: "D" },
        { base: "f", shift: "F" },
        { base: "g", shift: "G" },
        { base: "h", shift: "H" },
        { base: "j", shift: "J" },
        { base: "k", shift: "K" },
        { base: "l", shift: "L" },
        { base: ";", shift: ":" },
        { base: "'", shift: '"' },
    ],
    [
        { base: "z", shift: "Z" },
        { base: "x", shift: "X" },
        { base: "c", shift: "C" },
        { base: "v", shift: "V" },
        { base: "b", shift: "B" },
        { base: "n", shift: "N" },
        { base: "m", shift: "M" },
        { base: ",", shift: "<" },
        { base: ".", shift: ">" },
        { base: "/", shift: "?" },
    ],
    [
        { base: "`", shift: "~" },
        { base: " ", shift: " " },
    ],
];

interface KeyboardBarProps {
    nextKey: string;
    mode?: string;
}

export default function KeyboardBar({ nextKey, mode = 'normal' }: KeyboardBarProps) {
    const normalizedNextKey = nextKey.toLowerCase();
    const isDevMode = mode === 'dev';

    if (isDevMode) {
        return (
            <div className="mt-8 p-3 w-md sm:w-fit place-self-center bg-gray-200/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                <div className="flex flex-col gap-1.5 justify-center font-mono text-gray-600 dark:text-gray-400">
                    {DEV_KEYBOARD_LAYOUT.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1.5 justify-center">
                            {row.map((keyObj, keyIndex) => {
                                const isSpacebar = keyObj.base === " ";
                                const isBacktick = keyObj.base === "`";
                                
                                const isNextBase = nextKey === keyObj.base || normalizedNextKey === keyObj.base;
                                const isNextShift = nextKey === keyObj.shift;
                                const isNext = isNextBase || isNextShift;

                                return (
                                    <div
                                        key={`${keyObj.base}-${rowIndex}-${keyIndex}`}
                                        className={clsx(
                                            "h-12 flex flex-col items-center justify-center rounded-md bg-white dark:bg-gray-700 transition-all duration-100 ease-in-out text-xs",
                                            isSpacebar ? "w-64 px-8" : isBacktick ? "w-16" : "w-12",
                                            isNext && "transform -translate-y-0.5 scale-105 bg-emerald-500 text-white dark:text-white shadow-[0_0_20px_#10b981]"
                                        )}
                                    >
                                        {isSpacebar ? (
                                            <span className="text-sm">Space</span>
                                        ) : (
                                            <>
                                                <span className="text-[10px] opacity-60">{keyObj.shift}</span>
                                                <span className="font-semibold">{keyObj.base}</span>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 p-3 w-sm sm:w-fit place-self-center bg-gray-200/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col gap-1.5 justify-center font-mono text-gray-600 dark:text-gray-400">
                {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={row.join("-")} className="flex gap-1.5 justify-center">
                        {row.map((key) => {
                            const isNext = normalizedNextKey === key;
                            const isSpacebar = key === " ";

                            return (
                                <div
                                    key={key + rowIndex}
                                    className={clsx(
                                        "h-12 flex items-center justify-center rounded-md bg-white dark:bg-gray-700 transition-all duration-100 ease-in-out",
                                        isSpacebar ? "w-full px-20" : "w-12",
                                        isNext && "transform -translate-y-0.5 scale-105 bg-emerald-500 dark:text-white shadow-[0_0_20px_#10b981]"
                                    )}
                                >
                                    {isSpacebar ? "Space" : key}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}