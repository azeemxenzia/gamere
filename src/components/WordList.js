import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const strikethrough = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const WordList = ({ words, foundWords }) => {
  // Sort words to show found words at the bottom
  const sortedWords = [...words].sort((a, b) => {
    if (a.found && !b.found) return 1;
    if (!a.found && b.found) return -1;
    return a.word.localeCompare(b.word);
  });

  return (
    <WordListContainer>
      <ListHeader>
        <ListTitle>Words to Find</ListTitle>
        <ProgressBadge>
          {foundWords.length} / {words.length}
        </ProgressBadge>
      </ListHeader>
      <WordsGrid>
        {sortedWords.map((word, index) => (
          <WordItem 
            key={word.word} 
            found={word.found}
            index={index}
          >
            <WordItemContent>
              <StrikethroughLine found={word.found} />
              <WordText found={word.found}>{word.word}</WordText>
              {word.found && <CheckMark>✓</CheckMark>}
            </WordItemContent>
          </WordItem>
        ))}
      </WordsGrid>
    </WordListContainer>
  );
};

const WordListContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.4);
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  animation: ${fadeIn} 0.5s ease;
  max-width: 800px;
  width: 100%;
  margin: 0 auto 20px;

  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
    z-index: -1;
    filter: blur(2px);
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
`;

const ListTitle = styled.h3`
  margin: 0;
  color: #3a3a3a;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ProgressBadge = styled.div`
  background-color: rgba(64, 80, 160, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 80, 160, 0.2);
`;

const WordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
`;

const WordItem = styled.div`
  position: relative;
  padding: 8px 15px;
  background-color: ${props => props.found 
    ? 'rgba(76, 175, 80, 0.15)' 
    : 'rgba(255, 255, 255, 0.6)'
  };
  border-radius: 10px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s forwards ${props => props.index * 0.05}s;
  box-shadow: ${props => props.found 
    ? 'inset 0 0 0 1px rgba(76, 175, 80, 0.2), 0 2px 5px rgba(0, 0, 0, 0.05)'
    : 'inset 0 0 0 1px rgba(255, 255, 255, 0.4), 0 2px 5px rgba(0, 0, 0, 0.05)'
  };
  
  &:hover {
    transform: ${props => props.found ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.found 
      ? 'inset 0 0 0 1px rgba(76, 175, 80, 0.2), 0 2px 5px rgba(0, 0, 0, 0.05)'
      : 'inset 0 0 0 1px rgba(255, 255, 255, 0.7), 0 5px 15px rgba(0, 0, 0, 0.1)'
    };
  }
`;

const WordItemContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StrikethroughLine = styled.div`
  position: absolute;
  height: 2px;
  background-color: rgba(76, 175, 80, 0.6);
  left: 0;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
  width: ${props => props.found ? '100%' : '0'};
  animation: ${props => props.found ? strikethrough : 'none'} 0.5s forwards;
`;

const WordText = styled.span`
  font-weight: 500;
  color: ${props => props.found ? 'rgba(60, 60, 60, 0.6)' : 'rgba(40, 40, 40, 0.9)'};
  transition: color 0.3s ease;
  letter-spacing: 0.5px;
`;

const CheckMark = styled.span`
  margin-left: 5px;
  color: #4CAF50;
  font-weight: bold;
  animation: ${checkmarkAnimation} 0.5s forwards, ${bounce} 1s 0.5s ease-in-out;
`;

export default WordList; 