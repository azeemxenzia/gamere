import React, { useState } from 'react';
import styled from 'styled-components';
import StartScreen from './components/StartScreen';
import Level1Screen from './components/Level1Screen';
import Level2Screen from './components/Level2Screen';
import Level3Screen from './components/Level3Screen';
import Level4Screen from './components/Level4Screen';
import Level5Screen from './components/Level5Screen';

// Game stages
const GAME_STAGES = {
  START: 'start',
  LEVEL_1: 'level1',
  LEVEL_2: 'level2',
  LEVEL_3: 'level3',
  LEVEL_4: 'level4',
  LEVEL_5: 'level5'
};

const App = () => {
  const [gameStage, setGameStage] = useState(GAME_STAGES.START);

  const startGame = () => {
    setGameStage(GAME_STAGES.LEVEL_1);
  };

  const goToLevel2 = () => {
    setGameStage(GAME_STAGES.LEVEL_2);
  };

  const goToLevel3 = () => {
    setGameStage(GAME_STAGES.LEVEL_3);
  };

  const goToLevel4 = () => {
    setGameStage(GAME_STAGES.LEVEL_4);
  };

  const goToLevel5 = () => {
    setGameStage(GAME_STAGES.LEVEL_5);
  };

  const resetGame = () => {
    setGameStage(GAME_STAGES.START);
  };

  const renderGameStage = () => {
    switch (gameStage) {
      case GAME_STAGES.START:
        return <StartScreen onStartGame={startGame} />;
      case GAME_STAGES.LEVEL_1:
        return <Level1Screen onLevelComplete={goToLevel2} />;
      case GAME_STAGES.LEVEL_2:
        return <Level2Screen onLevelComplete={goToLevel3} />;
      case GAME_STAGES.LEVEL_3:
        return <Level3Screen onLevelComplete={goToLevel4} />;
      case GAME_STAGES.LEVEL_4:
        return <Level4Screen onLevelComplete={goToLevel5} />;
      case GAME_STAGES.LEVEL_5:
        return <Level5Screen onLevelComplete={resetGame} />;
      default:
        return <StartScreen onStartGame={startGame} />;
    }
  };

  return (
    <AppContainer>
      {renderGameStage()}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
`;

export default App; 