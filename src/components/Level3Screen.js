import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WordGrid from './WordGrid';
import WordList from './WordList';
import { generateWordGrid } from '../utils/gridGenerator';

const GRID_SIZE = 10;

const Level3Screen = ({ onLevelComplete }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([
    { word: 'PARIS', found: false },
    { word: 'LONDON', found: false },
    { word: 'TOKYO', found: false },
    { word: 'BERLIN', found: false },
    { word: 'ROME', found: false }
  ]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);

  useEffect(() => {
    // Generate the grid when component mounts
    const { grid: generatedGrid } = generateWordGrid(
      words,
      GRID_SIZE,
      'medium' // Medium difficulty for level 3
    );
    setGrid(generatedGrid);
  }, []);

  // Check if all words have been found
  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      setIsLevelComplete(true);
    }
  }, [foundWords, words]);

  // Handle when a word is found
  const handleWordFound = (word) => {
    // Check if word was already found
    if (foundWords.some(w => w.word === word)) {
      return;
    }
    
    // Mark word as found
    const foundWord = words.find(w => w.word === word);
    if (foundWord) {
      setFoundWords([...foundWords, foundWord]);
      
      // Update words list
      setWords(words.map(w => 
        w.word === word ? { ...w, found: true } : w
      ));
    }
  };

  // Handle level completion
  const handleNextLevel = () => {
    onLevelComplete();
  };

  // Handle hint usage - unlimited hints
  const useHint = () => {
    if (foundWords.length < words.length && !isHintActive) {
      setIsHintActive(true);
      
      // Automatically deactivate hint after 3 seconds
      setTimeout(() => {
        setIsHintActive(false);
      }, 3000);
    }
  };

  return (
    <LevelContainer backgroundStyle="cities">
      <LevelHeader>
        <LevelTitle>Level 3 - Cities</LevelTitle>
        <LevelProgressContainer>
          <LevelProgress>
            {foundWords.length} / {words.length} words found
          </LevelProgress>
          <HintButton 
            onClick={useHint} 
            disabled={isLevelComplete}
          >
            Hint
          </HintButton>
        </LevelProgressContainer>
      </LevelHeader>

      <WordList words={words} foundWords={foundWords} />
      
      {grid.length > 0 && (
        <WordGrid
          grid={grid}
          gridSize={GRID_SIZE}
          foundWords={words}
          onWordFound={handleWordFound}
          hintActive={isHintActive}
        />
      )}
      
      {isLevelComplete && (
        <LevelCompleteOverlay>
          <LevelCompleteCard>
            <CompleteTitle>Level 3 Complete!</CompleteTitle>
            <CompleteMessage>You found all the cities!</CompleteMessage>
            <NextLevelButton onClick={handleNextLevel}>
              Next Level
            </NextLevelButton>
          </LevelCompleteCard>
        </LevelCompleteOverlay>
      )}
    </LevelContainer>
  );
};

const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background: ${props => {
    switch (props.backgroundStyle) {
      case 'cities':
        return 'linear-gradient(135deg, #e6f2ff 0%, #d9e7ff 100%)';
      default:
        return 'linear-gradient(135deg, #f5f8ff 0%, #f0f4ff 100%)';
    }
  }};
`;

const LevelHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LevelProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const LevelTitle = styled.h2`
  color: #4050a0;
  margin: 0 0 15px;
  font-size: 1.8rem;
  text-align: center;
`;

const LevelProgress = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 0.9rem;
  color: #4050a0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HintButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#ff9800'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 0.9rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : '0 2px 4px rgba(255, 152, 0, 0.3)'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #f57c00;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 152, 0, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
  }
`;

const LevelCompleteOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const LevelCompleteCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const CompleteTitle = styled.h2`
  color: #4050a0;
  margin: 0 0 15px;
  font-size: 1.8rem;
`;

const CompleteMessage = styled.p`
  color: #576078;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const NextLevelButton = styled.button`
  background-color: #4caf50;
  color: white;
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 30px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  
  &:hover {
    background-color: #43a047;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
  }
`;

export default Level3Screen; 