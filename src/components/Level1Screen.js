import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import WordGrid from './WordGrid';
import WordList from './WordList';
import { generateWordGrid } from '../utils/gridGenerator';

const GRID_SIZE = 6;

// Animations
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

const Level1Screen = ({ onLevelComplete }) => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([
    { word: 'APPLE', found: false },
    { word: 'BANANA', found: false },
    { word: 'PEAR', found: false }
  ]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isHintActive, setIsHintActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adTimer, setAdTimer] = useState(10);
  const [adInProgress, setAdInProgress] = useState(false);

  useEffect(() => {
    // Generate the grid when component mounts
    const { grid: generatedGrid } = generateWordGrid(
      words,
      GRID_SIZE,
      'easy' // Easy difficulty for level 1
    );
    setGrid(generatedGrid);
    
    // Simulate loading for a smoother intro animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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

  // Start the hint with ad timer
  const requestHint = () => {
    if (foundWords.length < words.length && !isHintActive) {
      setShowAdModal(true);
      setAdInProgress(true);
      setAdTimer(3); // Set to 3 seconds
    }
  };

  // Activate the hint immediately
  const activateHint = () => {
    // If hint is already active, don't activate another one
    if (!isHintActive) {
      setIsHintActive(true);
      
      // Automatically deactivate hint after 3 seconds
      setTimeout(() => {
        setIsHintActive(false);
      }, 3000);
    }
  };

  // This function is no longer needed but kept for compatibility
  const cancelAd = () => {
    setShowAdModal(false);
    setAdInProgress(false);
    setAdTimer(10); // Reset timer
  };

  return (
    <LevelContainer>
      <BackgroundElements>
        <Fruit top="10%" left="5%" size="60px" rotate="15deg" delay="0s" image="🍎" />
        <Fruit top="20%" right="8%" size="70px" rotate="-20deg" delay="0.5s" image="🍌" />
        <Fruit bottom="15%" left="10%" size="55px" rotate="10deg" delay="1s" image="🍐" />
        <Fruit bottom="25%" right="10%" size="50px" rotate="-5deg" delay="1.5s" image="🍓" />
      </BackgroundElements>
      
      <LevelContent isLoading={isLoading}>
        <LevelHeader>
          <LevelTitle>Level 1: Fruits</LevelTitle>
          <LevelProgressContainer>
            <LevelProgress>
              {foundWords.length} / {words.length} words found
            </LevelProgress>
            <HintButton 
              onClick={requestHint} 
              disabled={isLevelComplete}
              animate={!isLevelComplete}
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
      </LevelContent>
      
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
            <CompleteTitle>Level 1 Complete!</CompleteTitle>
            <CompleteMessage>You found all the fruits!</CompleteMessage>
            <CompleteCelebration>🎉 🍎 🍌 🍐 🎉</CompleteCelebration>
            <NextLevelButton onClick={handleNextLevel}>
              Next Level
            </NextLevelButton>
          </LevelCompleteCard>
        </LevelCompleteOverlay>
      )}
    </LevelContainer>
  );
};

// Ad Modal Components
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
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

const AdModal = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 0.5s ease;
`;

const AdModalHeader = styled.div`
  background: linear-gradient(135deg, #4050A0, #5D6EC7);
  color: white;
  padding: 15px 20px;
  text-align: center;
`;

const AdModalTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
`;

const AdContent = styled.div`
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AdGraphic = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdIcon = styled.div`
  font-size: 3rem;
  animation: ${pulse} 2s infinite ease-in-out;
  z-index: 2;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AdSpinner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(64, 80, 160, 0.1);
  border-top: 4px solid rgba(64, 80, 160, 0.8);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  z-index: 1;
`;

const AdMessage = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
  width: 100%;
`;

const AdTimerDisplay = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: center;
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
  
  &:after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background: white;
    border-radius: 50%;
  }
`;

const AdTimerText = styled.div`
  position: relative;
  z-index: 2;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4050A0;
`;

const AdDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 10px;
`;

const AdControls = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
`;

const CancelButton = styled.button`
  background: transparent;
  color: #4050A0;
  border: 1px solid #4050A0;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(64, 80, 160, 0.1);
  }
`;

// Existing styled components
const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #fff9e6 0%, #ffefba 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
`;

const Fruit = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  font-size: ${props => props.size || '40px'};
  transform: rotate(${props => props.rotate || '0deg'});
  opacity: 0.15;
  z-index: 0;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  &:after {
    content: '${props => props.image}';
  }
`;

const LevelContent = styled.div`
  position: relative;
  z-index: 1;
  opacity: ${props => props.isLoading ? 0 : 1};
  transform: translateY(${props => props.isLoading ? '20px' : '0'});
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const LevelHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease;
`;

const LevelTitle = styled.h2`
  color: #4050a0;
  margin: 0 0 15px;
  font-size: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LevelProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const LevelProgress = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 1rem;
  color: #4050a0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-weight: 500;
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
  color: #4050a0;
  margin: 0 0 15px;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CompleteMessage = styled.p`
  color: #576078;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

const CompleteCelebration = styled.div`
  font-size: 2rem;
  margin-bottom: 25px;
  animation: ${pulse} 1s infinite ease-in-out;
`;

const NextLevelButton = styled.button`
  background: linear-gradient(135deg, #4caf50, #43a047);
  color: white;
  font-size: 1.2rem;
  padding: 12px 32px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 10px rgba(76, 175, 80, 0.3);
  font-weight: 600;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(76, 175, 80, 0.4);
    background: linear-gradient(135deg, #4caf50, #2e7d32);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  }
`;

export default Level1Screen; 