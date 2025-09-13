import { useEffect, useMemo, useRef, useState } from "react";
import { generateMoreWords } from "@/lib/TextGenerator";
import { DISPLAY_WORD_COUNT, getChunkInterval } from "@/constants/typing";
import type { TypingData, UseTypingTestParams } from "@/types/typing";
import { useCharacterCount } from "@/hooks/useCharacterCount";

export function useTypingTest({ text, isActive, isFinished, duration, setIsRunning, onTextUpdate, onComplete }: UseTypingTestParams) {
    const [currentText, setCurrentText] = useState("");
    const [typingData, setTypingData] = useState<TypingData[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wordPool, setWordPool] = useState<string[]>(text);
    const [displayWords, setDisplayWords] = useState<string[]>(
        text.slice(0, DISPLAY_WORD_COUNT)
    );
    const [wordOffset, setWordOffset] = useState(0);
    const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
    const [totalCorrectCharacters, setTotalCorrectCharacters] = useState(0);
    const [totalIncorrectKeystrokes, setTotalIncorrectKeystrokes] = useState(0);

    const targetText = useMemo(
        () => displayWords.join(" "),
        [displayWords]
    );

    const { correct: currentMatchCorrect, incorrect: currentMatchIncorrect } = useCharacterCount(currentText, targetText);

    // using refs cuz useInterval not apt solution here
    const currentTextRef = useRef("");
    const targetTextRef = useRef(targetText);
    const totalCorrectRef = useRef(0);
    const totalIncorrectRef = useRef(0);
    const currentCorrectRef = useRef(0);
    const currentIncorrectRef = useRef(0);
    const isFinishedRef = useRef(!!isFinished);
    const lastRecordedSecondRef = useRef<number>(0);
    const intervalIdRef = useRef<number | null>(null);

    useEffect(() => {
        currentTextRef.current = currentText;
        targetTextRef.current = targetText;
        totalCorrectRef.current = totalCorrectCharacters;
        totalIncorrectRef.current = totalIncorrectKeystrokes;
        currentCorrectRef.current = currentMatchCorrect;
        currentIncorrectRef.current = currentMatchIncorrect;
        isFinishedRef.current = !!isFinished;
    }, [currentText, targetText, totalCorrectCharacters, totalIncorrectKeystrokes, currentMatchCorrect, currentMatchIncorrect, isFinished]);

    useEffect(() => {
        setWordPool(text);
        setDisplayWords(text.slice(0, DISPLAY_WORD_COUNT));
        setWordOffset(0);
    }, [text]);

    // sliding window logic
    useEffect(() => {
        if (!isActive || isFinished) return;

        const typedChars = currentText.length;
        const targetChars = targetText.length;

        if (typedChars > targetChars * 0.7 && targetChars > 0) {
            const wordsTyped = currentText
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length;
            const wordsToShift = Math.max(1, Math.floor(wordsTyped * 0.3));
            const newOffset = wordOffset + wordsToShift;

            // before sliding window
            const correctInCurrentText = currentMatchCorrect;
            setTotalCharactersTyped((prev) => prev + currentText.length);
            setTotalCorrectCharacters((prev) => prev + correctInCurrentText);

            if (wordPool.length < newOffset + DISPLAY_WORD_COUNT) {
                const newWords = generateMoreWords(wordPool, 50);
                setWordPool(newWords);
                onTextUpdate?.(newWords);
            }

            const newDisplayWords = wordPool.slice(newOffset, newOffset + DISPLAY_WORD_COUNT);
            setDisplayWords(newDisplayWords);
            setWordOffset(newOffset);

            setCurrentText("");
        }

        if (wordPool.length < wordOffset + DISPLAY_WORD_COUNT * 2) {
            const newWords = generateMoreWords(wordPool, 50);
            setWordPool(newWords);
            onTextUpdate?.(newWords);
        }
    }, [currentText, targetText, wordPool, wordOffset, isActive, isFinished, onTextUpdate]);

    // to track typing performance at stable intervals
    useEffect(() => {
        if (!startTime) return;

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        lastRecordedSecondRef.current = 0;
        const chunk = getChunkInterval(duration);

        const id = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);

            if (isFinishedRef.current || elapsed <= 0) return;
            if (elapsed > duration) {
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                }
                return;
            }

            const shouldRecord = chunk === 1
                ? elapsed !== lastRecordedSecondRef.current
                : elapsed % chunk === 0 && elapsed !== lastRecordedSecondRef.current;

            if (!shouldRecord) return;

            // const curr = currentTextRef.current;
            // const target = targetTextRef.current;
            const baseCorrect = totalCorrectRef.current;
            const baseIncorrect = totalIncorrectRef.current;

            const correctInCurrentText = currentCorrectRef.current;
            const incorrectInCurrentText = currentIncorrectRef.current;

            const totalCorrect = baseCorrect + correctInCurrentText;
            const totalErrors = baseIncorrect + incorrectInCurrentText;
            const minutes = elapsed / 60;
            const currentWpm =
                totalCorrect > 0 && minutes > 0
                ? Math.round(totalCorrect / 5 / minutes)
                : 0;

            setTypingData((prev) => {
                const existingIndex = prev.findIndex((p) => p.second === elapsed);
                if (existingIndex >= 0) {
                    const copy = [...prev];
                    copy[existingIndex] = {
                        second: elapsed,
                        wpm: currentWpm,
                        errors: totalErrors,
                    };
                    return copy;
                }
                return [
                    ...prev,
                    { second: elapsed, wpm: currentWpm, errors: totalErrors },
                ].sort((a, b) => a.second - b.second);
            });

            lastRecordedSecondRef.current = elapsed;
        }, 250);

        intervalIdRef.current = id;

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
    }, [startTime, duration]);

    // for test completion
    useEffect(() => {
        if (!isFinished) return;

        const correctInCurrentText = currentMatchCorrect;
        const currentErrors = currentMatchIncorrect;
        const finalTotalCharactersTyped = totalCharactersTyped + currentText.length;
        const finalTotalCorrectCharacters = totalCorrectCharacters + correctInCurrentText;
        const finalTotalIncorrectKeystrokes = totalIncorrectKeystrokes + currentErrors;

        const minutes = duration / 60;
        const wpm = finalTotalCorrectCharacters > 0
            ? Math.round(finalTotalCorrectCharacters / 5 / minutes)
            : 0;

        const accuracy = finalTotalCharactersTyped > 0
            ? Math.round((finalTotalCorrectCharacters / finalTotalCharactersTyped) * 100)
            : 0;
        const errors = finalTotalIncorrectKeystrokes;

        let finalTypingData = [...typingData];
        if (startTime) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const finalDataPoint = { second: Math.min(elapsed, duration), wpm, errors };
            const existingIndex = finalTypingData.findIndex((item) => item.second === finalDataPoint.second);
            if (existingIndex >= 0) {
                finalTypingData[existingIndex] = finalDataPoint;
            } else {
                finalTypingData.push(finalDataPoint);
            }
            finalTypingData = finalTypingData.sort((a, b) => a.second - b.second);
        }

        onComplete({ wpm, accuracy, errors, typingData: finalTypingData });
    }, [isFinished]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isActive && !startTime) {
            setStartTime(Date.now());
            setIsRunning(true);
        }

        const value = e.target.value;
        const previousLength = currentText.length;
        setCurrentText(value);

        if (value.length > previousLength) {
            const newCharIndex = previousLength;
            if (newCharIndex < targetText.length && value[newCharIndex] !== targetText[newCharIndex]) {
                setTotalIncorrectKeystrokes((prev) => prev + 1);
            }
        }
    };

    const handleRestart = () => {
        setCurrentText("");
        setIsRunning(false);
        setStartTime(null);
        setTypingData([]);
        setWordOffset(0);
        setDisplayWords(wordPool.slice(0, DISPLAY_WORD_COUNT));
        setTotalCharactersTyped(0);
        setTotalCorrectCharacters(0);
        setTotalIncorrectKeystrokes(0);
        onComplete({ wpm: 0, accuracy: 0, errors: 0, typingData: [] });
    };

    return { currentText, targetText, handleChange, handleRestart };
}
