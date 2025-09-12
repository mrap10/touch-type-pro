import { useMemo } from 'react';

export const useCharacterCount = (currentText: string, targetText: string) => {
    return useMemo(() => {
        let correct = 0;
        let incorrect = 0;
        
        currentText.split("").forEach((char, index) => {
            if (char === targetText[index]) {
                correct++;
            } else {
                incorrect++;
            }
        });
        
        return { correct, incorrect };
    }, [currentText, targetText]);
};