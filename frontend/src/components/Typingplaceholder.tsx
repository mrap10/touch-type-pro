import clsx from "clsx";

interface TypingPlaceholderProps {
    targetText: string;
    currentText: string;
}

export default function TypingPlaceholder({ targetText, currentText }: TypingPlaceholderProps) {
    return (
        <div className="flex flex-wrap text-xl leading-relaxed font-mono">
            {targetText.split("").map((char, index) => (
                <span
                    key={index}
                    className={clsx(
                        "inline-block text-4xl font-mono text-gray-400",
                        char === "   " && "w-2",
                        index < currentText.length
                        ? currentText[index] === char
                            ? "text-green-500 bg-green-100"
                            : "text-red-500 bg-red-100"
                        : "text-gray-400"
                    )}
                >
                    {char === " " ? "\u00A0" : char} {/* non-breaking space */}
                </span>
            ))}
        </div>
    )
}