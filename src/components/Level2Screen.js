import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import WordGrid from './WordGrid';
import WordList from './WordList';
import { generateWordGrid } from '../utils/gridGenerator';

const GRID_SIZE = 8;

// Adding animations for the ad modal
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Level2Screen = ({ onLevelComplete }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([
    { word: 'LION', found: false },
    { word: 'TIGER', found: false },
    { word: 'BEAR', found: false },
    { word: 'WOLF', found: false }
  ]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);
  
  // Add ad related states
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(3);
  const [adInProgress, setAdInProgress] = useState(false);

  useEffect(() => {
    // Generate the grid when component mounts
    const { grid: generatedGrid } = generateWordGrid(
      words,
      GRID_SIZE,
      'medium' // Medium difficulty for level 2
    );
    setGrid(generatedGrid);
  }, []);

  // Check if all words have been found
  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      setIsLevelComplete(true);
    }
  }, [foundWords, words]);
  
  // Ad timer countdown
  useEffect(() => {
    let interval;
    if (adInProgress && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => prev - 1);
      }, 1000);
    } else if (adTimer === 0 && adInProgress) {
      // Ad finished, show hint
      setAdInProgress(false);
      setShowAdModal(false);
      activateHint();
      setAdTimer(3); // Reset timer for next time
    }
    
    return () => clearInterval(interval);
  }, [adInProgress, adTimer]);

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

  // Handle hint usage - now with ad placeholder
  const useHint = () => {
    if (foundWords.length < words.length && !isHintActive) {
      setShowAdModal(true);
      setAdInProgress(true);
      setAdTimer(3); // Set to 3 seconds
    }
  };
  
  // Activate the hint after ad completes
  const activateHint = () => {
    if (!isHintActive) {
      setIsHintActive(true);
      
      // Automatically deactivate hint after 3 seconds
      setTimeout(() => {
        setIsHintActive(false);
      }, 3000);
    }
  };
  
  // Cancel the ad viewing
  const cancelAd = () => {
    setShowAdModal(false);
    setAdInProgress(false);
    setAdTimer(3); // Reset timer
  };

  return (
    <LevelContainer backgroundStyle="animals">
      <LevelHeader>
        <LevelTitle>Level 2 - Animals</LevelTitle>
        <LevelProgressContainer>
          <LevelProgress>
            {foundWords.length} / {words.length} words found
          </LevelProgress>
          <HintButton 
            onClick={useHint} 
            disabled={isLevelComplete}
          >
            <HintIcon>💡</HintIcon>
            <span>Get Hint</span>
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
      
      {showAdModal && (
        <AdModalOverlay>
          <AdModal>
            <AdModalHeader>
              <AdModalTitle>Ad Placeholder</AdModalTitle>
            </AdModalHeader>
            <AdContent>
              <AdGraphic>
                <AdIcon>📣</AdIcon>
                <AdSpinner />
              </AdGraphic>
              <AdMessage>
                {adTimer > 0 ? (
                  <>
                    <div>Ad placeholder - will be replaced with real ads later</div>
                    <AdTimerDisplay>
                      <AdTimerCircle percent={adTimer * 33.3}>
                        <AdTimerText>{adTimer}</AdTimerText>
                      </AdTimerCircle>
                    </AdTimerDisplay>
                    <AdDescription>
                      Your hint will be available in {adTimer} seconds
                    </AdDescription>
                  </>
                ) : (
                  <div>Loading your hint...</div>
                )}
              </AdMessage>
            </AdContent>
            <AdControls>
              <CancelButton onClick={cancelAd}>
                Skip Ad
              </CancelButton>
            </AdControls>
          </AdModal>
        </AdModalOverlay>
      )}
      
      {isLevelComplete && (
        <LevelCompleteOverlay>
          <LevelCompleteCard>
            <CompleteTitle>Level 2 Complete!</CompleteTitle>
            <CompleteMessage>You found all the animals!</CompleteMessage>
            <NextLevelButton onClick={handleNextLevel}>
              Next Level
            </NextLevelButton>
          </LevelCompleteCard>
        </LevelCompleteOverlay>
      )}
    </LevelContainer>
  );
};

// Styled components for the Level
const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background: ${props => {
    switch(props.backgroundStyle) {
      case 'animals':
        return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
      default:
        return 'linear-gradient(135deg, #2196F3, #64B5F6)';
    }
  }};
`;

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const LevelTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LevelProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LevelProgress = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HintButton = styled.button`
  background-color: ${props => props.disabled ? 'rgba(204, 204, 204, 0.7)' : 'rgba(64, 80, 160, 0.9)'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : '0 4px 8px rgba(64, 80, 160, 0.3)'};
  transition: all 0.2s ease;
  animation: ${props => props.animate ? pulse : 'none'} 2s infinite ease-in-out;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background-color: rgba(64, 80, 160, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(64, 80, 160, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(64, 80, 160, 0.3);
  }
`;

const HintIcon = styled.span`
  display: inline-block;
  font-size: 1.2rem;
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
  animation: ${fadeIn} 0.3s ease;
`;

const LevelCompleteCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 0.5s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
`;

const CompleteTitle = styled.h2`
  color: #4CAF50;
  margin: 0 0 15px;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CompleteMessage = styled.p`
  color: #576078;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

const NextLevelButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  transition: all 0.2s ease;
  animation: ${pulse} 2s infinite ease-in-out;
  animation-delay: 1s;
  
  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  }
`;

// Ad Modal Styled Components
const AdModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const AdModal = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${pulse} 0.5s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
`;

const AdModalHeader = styled.div`
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  padding: 15px 20px;
  color: white;
  text-align: center;
`;

const AdModalTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AdContent = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AdGraphic = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdIcon = styled.div`
  font-size: 2.5rem;
  z-index: 1;
`;

const AdSpinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(76, 175, 80, 0.2);
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
`;

const AdMessage = styled.div`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const AdTimerDisplay = styled.div`
  margin: 15px 0;
`;

const AdTimerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(
    #4CAF50 ${props => props.percent}%, 
    #e0e0e0 ${props => props.percent}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:before {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: white;
  }
`;

const AdTimerText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const AdDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  max-width: 80%;
`;

const AdControls = styled.div`
  padding: 0 30px 20px;
  display: flex;
  justify-content: center;
`;

const CancelButton = styled.button`
  background-color: rgba(97, 97, 97, 0.9);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(97, 97, 97, 1);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default Level2Screen; 