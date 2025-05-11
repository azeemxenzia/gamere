import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(64, 80, 160, 0.5); }
  50% { box-shadow: 0 0 30px rgba(64, 80, 160, 0.8), 0 0 50px rgba(64, 80, 160, 0.3); }
  100% { box-shadow: 0 0 10px rgba(64, 80, 160, 0.5); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const StartScreen = ({ onStartGame }) => {
  const [isReady, setIsReady] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Animation sequencing
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Change level preview every few seconds
  useEffect(() => {
    const levelInterval = setInterval(() => {
      setLevel(current => current < 5 ? current + 1 : 1);
    }, 3000);
    
    return () => clearInterval(levelInterval);
  }, []);

  return (
    <StartScreenContainer>
      <BackgroundElements>
        <FloatingShape top="5%" left="5%" size="80px" delay="0s" type="rectangle" />
        <FloatingShape top="20%" right="8%" size="60px" delay="0.3s" type="circle" />
        <FloatingShape bottom="15%" left="10%" size="50px" delay="0.6s" type="triangle" />
        <FloatingShape bottom="25%" right="15%" size="70px" delay="0.9s" type="star" />
        <FloatingShape top="35%" left="20%" size="40px" delay="1.2s" type="letter" letter="W" />
        <FloatingShape top="45%" right="25%" size="45px" delay="1.5s" type="letter" letter="S" />
      </BackgroundElements>
    
      <ContentWrapper isReady={isReady}>
        <GameTitleWrapper>
          <GameTitle>Word Search</GameTitle>
          <GameSubtitle>Challenge Your Brain!</GameSubtitle>
        </GameTitleWrapper>
        
        <GameDescription>
          Find hidden words in a colorful grid of letters across five increasingly challenging levels.
        </GameDescription>
        
        <GameLogo animate={isReady}>
          <LogoImage 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZmlsbD0ibm9uZSI+CiAgPHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSIyOCIgZmlsbD0iI2YzZjZmZiIvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwLCA0MCkiPgogICAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRTlFRkZFIiBzdHJva2U9IiM5REFDQzYiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHRleHQgeD0iMTUiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNDA1MEEwIj5XPC90ZXh0PgogICAgPHJlY3QgeD0iMzUiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0U5RUZGRSIgc3Ryb2tlPSIjOURBQ0M2IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDx0ZXh0IHg9IjUwIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQwNTBBMCI+TzwvdGV4dD4KICAgIDxyZWN0IHg9IjcwIiB5PSIwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNFOUVGRkUiIHN0cm9rZT0iIzlEQUNDNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8dGV4dCB4PSI4NSIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0MDUwQTAiPlI8L3RleHQ+CiAgICA8cmVjdCB4PSIxMDUiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0U5RUZGRSIgc3Ryb2tlPSIjOURBQ0M2IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDx0ZXh0IHg9IjEyMCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0MDUwQTAiPkQ8L3RleHQ+CiAgICAKICAgIDxyZWN0IHg9IjAiIHk9IjM1IiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNFOUVGRkUiIHN0cm9rZT0iIzlEQUNDNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8dGV4dCB4PSIxNSIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0MDUwQTAiPkE8L3RleHQ+CiAgICAKICAgIDxyZWN0IHg9IjAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNFOUVGRkUiIHN0cm9rZT0iIzlEQUNDNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8dGV4dCB4PSIxNSIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0MDUwQTAiPlQ8L3RleHQ+CiAgICAKICAgIDxyZWN0IHg9IjM1IiB5PSI3MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRTlFRkZFIiBzdHJva2U9IiM5REFDQzYiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHRleHQgeD0iNTAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNDA1MEEwIj5FPC90ZXh0PgogICAgCiAgICA8cmVjdCB4PSI3MCIgeT0iNzAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0U5RUZGRSIgc3Ryb2tlPSIjOURBQ0M2IiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDx0ZXh0IHg9Ijg1IiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQwNTBBMCI+UzwvdGV4dD4KICAgIAogICAgPHJlY3QgeD0iMTA1IiB5PSI3MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRTlFRkZFIiBzdHJva2U9IiM5REFDQzYiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHRleHQgeD0iMTIwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzQwNTBBMCI+VDwvdGV4dD4KICAgIAogICAgPCEtLSBIaWdobGlnaHQgZm9yIFdPUkQgLS0+CiAgICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTM1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNENBRjUwIiBvcGFjaXR5PSIwLjYiLz4KICAgIDwhLS0gSGlnaGxpZ2h0IGZvciBTRUFSQ0ggLS0+CiAgICA8cmVjdCB4PSI3MCIgeT0iNzAiIHdpZHRoPSI2NSIgaGVpZ2h0PSIxMCIgZmlsbD0iIzIxOTZGMyIgb3BhY2l0eT0iMC42Ii8+CiAgPC9nPgo8L3N2Zz4K"
            alt="Word Search Game Logo"
          />
        </GameLogo>
        
        <LevelShowcase>
          <LevelLabel>Preview Level {level}</LevelLabel>
          <LevelPreview level={level} />
        </LevelShowcase>
        
        <ButtonsContainer>
          <PlayButton onClick={onStartGame}>
            <PlayButtonText>START GAME</PlayButtonText>
          </PlayButton>
        </ButtonsContainer>
        
        <GameInstructions>
          <InstructionTitle>How to Play:</InstructionTitle>
          <InstructionList>
            <InstructionItem>
              <InstructionIcon>👁️</InstructionIcon>
              <InstructionText>Find all words in the grid</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionIcon>👆</InstructionIcon>
              <InstructionText>Tap or click and drag to select words</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionIcon>↔️</InstructionIcon>
              <InstructionText>Words can appear horizontally, vertically or diagonally</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionIcon>💡</InstructionIcon>
              <InstructionText>Get unlimited hints by watching a brief 10-second ad</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <InstructionIcon>🌟</InstructionIcon>
              <InstructionText>Complete all 5 levels to win!</InstructionText>
            </InstructionItem>
          </InstructionList>
        </GameInstructions>
      </ContentWrapper>
    </StartScreenContainer>
  );
};

// Level preview component
const LevelPreview = ({ level }) => {
  const getThemeColor = () => {
    switch(level) {
      case 1: return '#ffefba'; // fruits
      case 2: return '#f2fff8'; // animals
      case 3: return '#e6f2ff'; // cities
      case 4: return '#e8f5e9'; // sports
      case 5: return '#e2e7fd'; // programming
      default: return '#f0f4ff';
    }
  };
  
  const getThemeIcon = () => {
    switch(level) {
      case 1: return '🍎';
      case 2: return '🦁';
      case 3: return '🏙️';
      case 4: return '⚽';
      case 5: return '💻';
      default: return '⭐';
    }
  };

  return (
    <PreviewContainer color={getThemeColor()}>
      <PreviewIcon>{getThemeIcon()}</PreviewIcon>
      <PreviewDifficulty>
        {[...Array(level)].map((_, i) => (
          <DifficultyDot key={i} active={true} />
        ))}
        {[...Array(5-level)].map((_, i) => (
          <DifficultyDot key={i+level} active={false} />
        ))}
      </PreviewDifficulty>
    </PreviewContainer>
  );
};

// Define styled components
const StartScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8ff 0%, #e9effd 100%);
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

const FloatingShape = styled.div`
  position: absolute;
  top: ${props => props.top || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  opacity: 0.08;
  z-index: 0;
  animation: ${float} 15s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  ${props => {
    switch(props.type) {
      case 'circle':
        return `
          border-radius: 50%;
          background-color: #4050a0;
        `;
      case 'triangle':
        return `
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background-color: #4caf50;
        `;
      case 'star':
        return `
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          background-color: #ff9800;
        `;
      case 'letter':
        return `
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: calc(${props.size} * 0.6);
          font-weight: bold;
          color: #4050a0;
          opacity: 0.2;
          
          &:before {
            content: '${props.letter}';
          }
        `;
      default:
        return `
          background-color: #2196F3;
        `;
    }
  }}
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  opacity: ${props => props.isReady ? 1 : 0};
  transform: translateY(${props => props.isReady ? 0 : '30px'});
  transition: opacity 0.7s ease, transform 0.7s ease;
`;

const GameTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.7s ease;
`;

const GameTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  background: linear-gradient(135deg, #4050a0 0%, #5d6ec7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 5px;
  text-align: center;
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GameSubtitle = styled.h2`
  font-size: 1.2rem;
  color: #576078;
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
`;

const GameDescription = styled.p`
  font-size: 1.1rem;
  color: #576078;
  margin-bottom: 30px;
  text-align: center;
  max-width: 550px;
  line-height: 1.5;
  animation: ${fadeIn} 0.8s ease;
`;

const GameLogo = styled.div`
  margin-bottom: 30px;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.animate ? float : 'none'} 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 15px rgba(64, 80, 160, 0.2));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(2deg);
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 28px;
`;

const LevelShowcase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.9s ease;
`;

const LevelLabel = styled.div`
  font-size: 1rem;
  color: #576078;
  margin-bottom: 10px;
  font-weight: 500;
`;

const PreviewContainer = styled.div`
  background-color: ${props => props.color};
  width: 120px;
  height: 120px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  animation: ${pulse} 2s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
    z-index: 0;
  }
`;

const PreviewIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: ${float} 3s infinite ease-in-out;
  z-index: 1;
`;

const PreviewDifficulty = styled.div`
  display: flex;
  gap: 5px;
  z-index: 1;
`;

const DifficultyDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4050a0' : 'rgba(64, 80, 160, 0.2)'};
  transition: all 0.3s ease;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  animation: ${fadeIn} 1s ease;
`;

const PlayButton = styled.button`
  background: linear-gradient(135deg, #4050a0 0%, #5d6ec7 100%);
  color: white;
  font-size: 1.2rem;
  padding: 16px 50px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(64, 80, 160, 0.3);
  animation: ${pulse} 2s infinite ease-in-out;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(64, 80, 160, 0.4);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(64, 80, 160, 0.3);
  }
`;

const PlayButtonText = styled.span`
  font-weight: 600;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
`;

const GameInstructions = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  animation: ${fadeIn} 1.1s ease;
`;

const InstructionTitle = styled.h3`
  margin: 0 0 20px;
  color: #4050a0;
  font-size: 1.3rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, #4050a0, #5d6ec7);
    border-radius: 3px;
  }
`;

const InstructionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InstructionItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #576078;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InstructionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background-color: rgba(64, 80, 160, 0.1);
  border-radius: 50%;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 1.2rem;
`;

const InstructionText = styled.span`
  flex-grow: 1;
  font-size: 1rem;
  line-height: 1.4;
`;

export default StartScreen; 