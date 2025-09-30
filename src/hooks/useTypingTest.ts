import { useEffect, useMemo, useRef, useState } from "react";
import { generateMoreWords } from "@/lib/TextGenerator";
import { DISPLAY_WORD_COUNT, getChunkInterval } from "@/constants/typing";
import type { TypingData, UseTypingTestParams } from "@/types/typing";
import { useCharacterCount } from "@/hooks/useCharacterCount";

export function useTypingTest({ text, isActive, isFinished, duration, setIsRunning, onTextUpdate, onComplete, onProgress }: UseTypingTestParams) {
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
    const [wordsCompleted, setWordsCompleted] = useState(0);
    const DEFAULT_RACE_TARGET = 40;
    const RACE_WORD_TARGET = Math.max(DEFAULT_RACE_TARGET, text.length); // if server sends larger text, use that
    const disableSlidingWindow = RACE_WORD_TARGET <= DISPLAY_WORD_COUNT;
    const hasCompletedRef = useRef(false);
    const initialTextRef = useRef<string[]>(text);

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
        const isExpansion = text.length >= initialTextRef.current.length && 
                           initialTextRef.current.every((word, index) => word === text[index]);
        
        if (isExpansion) {
            // word pool expansion
            setWordPool(text);
        } else {
            // entire pool reset (timer change or test restarts)
            initialTextRef.current = text;
            setWordPool(text);
            setDisplayWords(text.slice(0, DISPLAY_WORD_COUNT));
            setWordOffset(0);
            setWordsCompleted(0);

            setCurrentText("");
            setStartTime(null);
            setTypingData([]);
            setTotalCharactersTyped(0);
            setTotalCorrectCharacters(0);
            setTotalIncorrectKeystrokes(0);
            hasCompletedRef.current = false;
            setIsRunning(false);
        }
    }, [text]);

    // sliding window logic (disabled for short races)
    useEffect(() => {
        if (!isActive || isFinished || disableSlidingWindow) return;

        const typedChars = currentText.length;
        const targetChars = targetText.length;

        if (typedChars > targetChars * 0.7 && targetChars > 0) {
            // ended with a space (fully completed word) vs partial current word
            const endsWithSpace = /\s$/.test(currentText);
            const tokens = currentText.trim().length > 0
                ? currentText.trim().split(/\s+/)
                : [];
            const fullyCompletedWords = endsWithSpace ? tokens.length : Math.max(0, tokens.length - 1);

            if (fullyCompletedWords > 0) {
                const completedPortionExpected = displayWords
                    .slice(0, fullyCompletedWords)
                    .join(" ") + " ";

                const commitLength = Math.min(completedPortionExpected.length, currentText.length);

                let commitCorrect = 0;
                let commitIncorrect = 0;
                for (let i = 0; i < commitLength; i++) {
                    if (currentText[i] === targetText[i]) commitCorrect++; else commitIncorrect++;
                }

                setTotalCharactersTyped(prev => prev + commitLength);
                setTotalCorrectCharacters(prev => prev + commitCorrect);
                setWordsCompleted(prev => prev + fullyCompletedWords);

                const newOffset = wordOffset + fullyCompletedWords;

                if (wordPool.length < newOffset + DISPLAY_WORD_COUNT) {
                    const newWords = generateMoreWords(wordPool, 50);
                    setWordPool(newWords);
                    onTextUpdate?.(newWords);
                }

                const newDisplayWords = wordPool.slice(newOffset, newOffset + DISPLAY_WORD_COUNT);
                setDisplayWords(newDisplayWords);
                setWordOffset(newOffset);

                const remaining = currentText.slice(commitLength);
                setCurrentText(remaining);
            }
        }

        if (wordPool.length < wordOffset + DISPLAY_WORD_COUNT * 2) {
            const newWords = generateMoreWords(wordPool, 50);
            setWordPool(newWords);
            onTextUpdate?.(newWords);
        }
    }, [currentText, targetText, wordPool, wordOffset, isActive, isFinished, onTextUpdate, disableSlidingWindow, displayWords]);

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
    }, [isFinished, currentMatchCorrect, currentMatchIncorrect, currentText.length, duration, startTime, totalCharactersTyped, totalCorrectCharacters, totalIncorrectKeystrokes, typingData]); // Remove onComplete from dependencies

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!startTime) {
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

        if (onProgress && startTime) {
            // words completed: cumulative completed + current window words
            const currentWindowWords = currentText.trim().length > 0
                ? currentText.trim().split(/\s+/).filter(w => w.length > 0).length
                : 0;
            const totalWordsTyped = wordsCompleted + currentWindowWords;

            let progress = (totalWordsTyped / RACE_WORD_TARGET) * 100;
            if (totalWordsTyped < 3) {
                const avgCharsPerWord = 5;
                const charsTyped = currentText.length + totalCharactersTyped;
                progress = Math.max(progress, (charsTyped / (RACE_WORD_TARGET * avgCharsPerWord)) * 100);
            }
            progress = Math.min(progress, 100);
            const timeElapsed = (Date.now() - startTime) / 1000 / 60;
            const currentCorrect = currentMatchCorrect + totalCorrectCharacters;
            const currentWpm = timeElapsed > 0 && currentCorrect > 0 ? Math.round(currentCorrect / 5 / timeElapsed) : 0;
            const totalTyped = value.length + totalCharactersTyped;
            const currentAccuracy = totalTyped > 0 ? Math.round(((currentCorrect) / totalTyped) * 100) : 100;
            
            onProgress(progress, currentWpm, currentAccuracy);
            if (progress >= 100 && !hasCompletedRef.current) {
                hasCompletedRef.current = true;
                // trigger completion sequence
                const minutes = timeElapsed;
                const finalCorrect = currentCorrect;
                const wpm = minutes > 0 && finalCorrect > 0 ? Math.round(finalCorrect / 5 / minutes) : 0;
                const accuracy = totalTyped > 0 ? Math.round((finalCorrect / totalTyped) * 100) : 0;
                onComplete({ wpm, accuracy, errors: totalIncorrectKeystrokes, typingData });
            }
        }
    };

    const handleRestart = () => {
        initialTextRef.current = wordPool;
        setCurrentText("");
        setIsRunning(false);
        setStartTime(null);
        setTypingData([]);
        setWordOffset(0);
        setDisplayWords(wordPool.slice(0, DISPLAY_WORD_COUNT));
        setTotalCharactersTyped(0);
        setTotalCorrectCharacters(0);
        setTotalIncorrectKeystrokes(0);
        setWordsCompleted(0);
        hasCompletedRef.current = false;
        onComplete({ wpm: 0, accuracy: 0, errors: 0, typingData: [] });
    };

    return { currentText, targetText, handleChange, handleRestart };
}
