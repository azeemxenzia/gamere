import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideIn = keyframes`
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(100, 150, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const WordGrid = ({ grid, gridSize, foundWords, onWordFound, hintActive }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState({});
  const [notification, setNotification] = useState(null);
  const [hintCells, setHintCells] = useState([]);
  const [isGridReady, setIsGridReady] = useState(false);
  
  // Sound references
  const tapSoundRef = useRef(null);
  const wowSoundRef = useRef(null);

  // Initialize sounds
  useEffect(() => {
    // Create audio elements directly
    tapSoundRef.current = new Audio(`${process.env.PUBLIC_URL}/sounds/tap.mp3`);
    wowSoundRef.current = new Audio(`${process.env.PUBLIC_URL}/sounds/wow.mp3`);
    
    // Load the sounds
    tapSoundRef.current.load();
    wowSoundRef.current.load();
    
    // No need for cleanup as these aren't added to the DOM
  }, []);

  // Grid animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGridReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Function to play tap sound
  const playTapSound = () => {
    if (tapSoundRef.current) {
      // Create a new Audio instance each time to allow overlapping sounds
      const sound = new Audio(`${process.env.PUBLIC_URL}/sounds/tap.mp3`);
      sound.volume = 1.0;
      sound.play().catch(err => {
        console.log("Error playing tap sound:", err);
      });
    }
  };

  // Function to play wow sound
  const playWowSound = () => {
    if (wowSoundRef.current) {
      // Create a new Audio instance to ensure it plays
      const sound = new Audio(`${process.env.PUBLIC_URL}/sounds/wow.mp3`);
      sound.volume = 1.0;
      sound.play().catch(err => {
        console.log("Error playing wow sound:", err);
      });
    }
  };

  // For touch and mouse events
  const startSelection = (row, col) => {
    setIsDragging(true);
    setSelectedCells([{ row, col }]);
    playTapSound();
  };

  const moveSelection = (row, col) => {
    if (!isDragging) return;
    
    // Ensure we're moving in a straight line (horizontally, vertically, or diagonally)
    if (selectedCells.length > 0) {
      const start = selectedCells[0];
      const isValidMove = isInLine(start.row, start.col, row, col);
      
      if (isValidMove) {
        // Generate all cells in the line
        const lineCells = getCellsInLine(start.row, start.col, row, col);
        
        // Only play sound if we've moved to a new cell
        if (lineCells.length !== selectedCells.length) {
          playTapSound();
        }
        
        setSelectedCells(lineCells);
      }
    }
  };

  const endSelection = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if the selected cells form a valid word
    const word = selectedCellsToWord(selectedCells, grid);
    const reversedWord = selectedCellsToWord([...selectedCells].reverse(), grid);
    
    let found = false;
    if (foundWords.map(w => w.word).includes(word)) {
      found = true;
      onWordFound(word);
      
      // Play wow sound
      playWowSound();
      
      // Show notification
      setNotification({ word, color: getRandomHighlightColor() });
      setTimeout(() => setNotification(null), 2000);
      
      // Add highlight for this word
      const key = `${selectedCells[0].row}-${selectedCells[0].col}-${selectedCells[selectedCells.length - 1].row}-${selectedCells[selectedCells.length - 1].col}`;
      setHighlightedWords(prev => ({
        ...prev,
        [key]: {
          cells: [...selectedCells],
          color: getRandomHighlightColor(),
        }
      }));
    } else if (foundWords.map(w => w.word).includes(reversedWord)) {
      found = true;
      onWordFound(reversedWord);
      
      // Play wow sound
      playWowSound();
      
      // Show notification
      setNotification({ word: reversedWord, color: getRandomHighlightColor() });
      setTimeout(() => setNotification(null), 2000);
      
      // Add highlight for this word
      const key = `${selectedCells[selectedCells.length - 1].row}-${selectedCells[selectedCells.length - 1].col}-${selectedCells[0].row}-${selectedCells[0].col}`;
      setHighlightedWords(prev => ({
        ...prev,
        [key]: {
          cells: [...selectedCells].reverse(),
          color: getRandomHighlightColor(),
        }
      }));
    }
    
    if (!found) {
      // Clear selection if no word was found
      setSelectedCells([]);
    }
  };

  // Handle hint activation
  useEffect(() => {
    if (hintActive) {
      // Get unfound words
      const unfoundWords = foundWords.filter(word => !word.found);
      
      if (unfoundWords.length > 0) {
        // Select a random unfound word
        const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
        
        // Find this word's position in the grid
        const cells = findWordInGrid(randomWord.word, grid, gridSize);
        
        if (cells.length > 0) {
          // Highlight the first few letters as a hint
          const hintLength = Math.min(3, cells.length);
          setHintCells(cells.slice(0, hintLength));
          
          // Clear hint when deactivated
          return () => setHintCells([]);
        }
      }
    } else {
      setHintCells([]);
    }
  }, [hintActive, foundWords, grid, gridSize]);

  // Find a specific word in the grid
  const findWordInGrid = (word, grid, gridSize) => {
    // Try all possible starting positions
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // If the first letter matches, check all directions
        if (grid[row][col] === word[0]) {
          // Check all directions
          const directions = [
            [0, 1],   // right
            [1, 0],   // down
            [0, -1],  // left
            [-1, 0],  // up
            [1, 1],   // down-right
            [1, -1],  // down-left
            [-1, 1],  // up-right
            [-1, -1]  // up-left
          ];
          
          for (const [rowDir, colDir] of directions) {
            const cells = [];
            let valid = true;
            
            // Check the word in this direction
            for (let i = 0; i < word.length; i++) {
              const newRow = row + i * rowDir;
              const newCol = col + i * colDir;
              
              // Check boundaries
              if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
                valid = false;
                break;
              }
              
              // Check letter
              if (grid[newRow][newCol] !== word[i]) {
                valid = false;
                break;
              }
              
              cells.push({ row: newRow, col: newCol });
            }
            
            if (valid) {
              return cells;
            }
          }
        }
      }
    }
    
    return [];
  };

  // Helper functions
  const isInLine = (startRow, startCol, endRow, endCol) => {
    // Horizontal
    if (startRow === endRow) return true;
    // Vertical
    if (startCol === endCol) return true;
    // Diagonal
    return Math.abs(startRow - endRow) === Math.abs(startCol - endCol);
  };

  const getCellsInLine = (startRow, startCol, endRow, endCol) => {
    const cells = [];
    
    // Calculate direction
    const rowDir = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colDir = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    
    // Calculate number of steps
    const steps = Math.max(
      Math.abs(endRow - startRow),
      Math.abs(endCol - startCol)
    );
    
    // Generate all cells in the line
    for (let i = 0; i <= steps; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;
      
      // Check if cell is within grid bounds
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        cells.push({ row, col });
      }
    }
    
    return cells;
  };

  const selectedCellsToWord = (cells, grid) => {
    return cells.map(cell => grid[cell.row][cell.col]).join('');
  };

  const getRandomHighlightColor = () => {
    const colors = [
      '#FF5252', // Red
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#FFC107', // Yellow
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#00BCD4'  // Cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Check if a cell is currently selected
  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Get the cell index in the selection (for animated selection effect)
  const getCellSelectionIndex = (row, col) => {
    return selectedCells.findIndex(cell => cell.row === row && cell.col === col);
  };

  // Check if a cell is part of a found word
  const getCellHighlight = (row, col) => {
    for (const key in highlightedWords) {
      const highlight = highlightedWords[key];
      if (highlight.cells.some(cell => cell.row === row && cell.col === col)) {
        return highlight.color;
      }
    }
    return null;
  };

  // Check if a cell is part of the hint
  const isHintCell = (row, col) => {
    return hintCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <>
      <GameContainer>
        <GridContainer size={gridSize} isReady={isGridReady}>
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              const selectionIndex = getCellSelectionIndex(rowIndex, colIndex);
              const highlightColor = getCellHighlight(rowIndex, colIndex);
              const isHint = isHintCell(rowIndex, colIndex);
              const cellIndex = rowIndex * gridSize + colIndex;
              
              return (
                <GridCell 
                  key={`${rowIndex}-${colIndex}`}
                  isSelected={isSelected}
                  selectionIndex={selectionIndex}
                  highlightColor={highlightColor}
                  isHint={isHint}
                  gridSize={gridSize}
                  cellIndex={cellIndex}
                  onMouseDown={() => startSelection(rowIndex, colIndex)}
                  onMouseEnter={() => moveSelection(rowIndex, colIndex)}
                  onMouseUp={() => endSelection()}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startSelection(rowIndex, colIndex);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    if (element && element.dataset.row !== undefined && element.dataset.col !== undefined) {
                      moveSelection(parseInt(element.dataset.row), parseInt(element.dataset.col));
                    }
                  }}
                  onTouchEnd={() => endSelection()}
                  data-row={rowIndex}
                  data-col={colIndex}
                >
                  {letter}
                </GridCell>
              );
            })
          ))}
        </GridContainer>
        
        <ConnectionLine 
          selectedCells={selectedCells} 
          gridSize={gridSize} 
        />
      </GameContainer>
      
      {notification && (
        <WordFoundNotification color={notification.color}>
          <NotificationContent>
            <NotificationWord>{notification.word}</NotificationWord>
            <NotificationLabel>FOUND!</NotificationLabel>
          </NotificationContent>
        </WordFoundNotification>
      )}
    </>
  );
};

// Connection line between selected cells
const ConnectionLine = ({ selectedCells, gridSize }) => {
  if (selectedCells.length < 2) return null;
  
  // Create a canvas to draw the line
  return (
    <LineCanvas
      selectedCells={selectedCells}
      gridSize={gridSize}
    />
  );
};

const LineCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
  
  &:after {
    content: '';
    position: absolute;
    
    ${props => {
      if (props.selectedCells && props.selectedCells.length >= 2) {
        const first = props.selectedCells[0];
        const last = props.selectedCells[props.selectedCells.length - 1];
        
        // Calculate the cell size based on grid size
        const cellSize = `calc((100% - ${props.gridSize * 6}px) / ${props.gridSize})`;
        
        // Calculate the center of the first cell
        const firstCenterX = `calc(${first.col} * (${cellSize} + 6px) + ${cellSize} / 2)`;
        const firstCenterY = `calc(${first.row} * (${cellSize} + 6px) + ${cellSize} / 2)`;
        
        // Calculate the center of the last cell
        const lastCenterX = `calc(${last.col} * (${cellSize} + 6px) + ${cellSize} / 2)`;
        const lastCenterY = `calc(${last.row} * (${cellSize} + 6px) + ${cellSize} / 2)`;
        
        return `
          top: ${firstCenterY};
          left: ${firstCenterX};
          width: calc(${lastCenterX} - ${firstCenterX});
          height: calc(${lastCenterY} - ${firstCenterY});
          transform-origin: top left;
          background: linear-gradient(to right, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.7));
          height: 5px;
          border-radius: 3px;
          transform: rotate(${Math.atan2(
            parseFloat(lastCenterY.replace('calc(', '').split(')')[0]) - 
            parseFloat(firstCenterY.replace('calc(', '').split(')')[0]), 
            parseFloat(lastCenterX.replace('calc(', '').split(')')[0]) - 
            parseFloat(firstCenterX.replace('calc(', '').split(')')[0])
          )}rad);
          box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
        `;
      }
      return '';
    }}
  }
`;

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 800px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 15px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: 95vmin;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  transform: ${props => props.isReady ? 'scale(1)' : 'scale(0.95)'};
  opacity: ${props => props.isReady ? '1' : '0'};
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              opacity 0.5s ease;
  
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

const GridCell = styled.div`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.8rem, 3.5vw, 1.8rem);
  font-weight: bold;
  position: relative;
  background-color: ${props => 
    props.isHint 
      ? 'rgba(255, 152, 0, 0.6)' 
      : props.isSelected 
      ? 'rgba(33, 150, 243, 0.7)' 
      : props.highlightColor 
      ? `${props.highlightColor}55` 
      : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${props => 
    props.isSelected || props.isHint 
      ? 'white' 
      : props.highlightColor 
      ? 'rgba(0, 0, 0, 0.8)' 
      : 'rgba(10, 20, 50, 0.9)'
  };
  border-radius: 12px;
  box-shadow: ${props => 
    props.isSelected 
      ? '0 0 15px rgba(33, 150, 243, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.6)' 
      : props.isHint 
      ? '0 0 15px rgba(255, 152, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.6)' 
      : props.highlightColor 
      ? `0 4px 15px ${props.highlightColor}33, inset 0 0 0 1px rgba(255, 255, 255, 0.6)` 
      : '0 4px 8px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
  };
  transition: transform 0.15s ease, 
              background-color 0.2s ease, 
              box-shadow 0.2s ease, 
              color 0.2s ease;
  touch-action: none;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  text-shadow: ${props => 
    props.isSelected || props.isHint 
      ? '0 1px 2px rgba(0, 0, 0, 0.4)' 
      : 'none'};
  
  animation: ${props => {
    if (props.isHint) {
      return css`${pulseAnimation} 1.5s infinite ease-in-out`;
    }
    else if (props.highlightColor) {
      return css`${popIn} 0.5s forwards`;
    }
    else {
      return css`${slideIn} 0.3s forwards ${props.cellIndex * 0.01}s`;
    }
  }};
  
  ${props => props.isSelected && css`
    transform: ${props.selectionIndex === 0 || props.selectionIndex === props.selectedCells - 1 
      ? 'scale(1.1)' 
      : 'scale(1.05)'};
    z-index: 2;
    animation: ${glowAnimation} 1.5s infinite ease-in-out;
  `}
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.5) 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      rgba(255, 255, 255, 0) 100%);
    border-radius: inherit;
    z-index: 0;
  }
  
  &:after {
    content: '';
    position: absolute;
    height: 40%;
    width: 100%;
    background: linear-gradient(to bottom, 
      rgba(255, 255, 255, 0.2) 0%, 
      rgba(255, 255, 255, 0) 100%);
    top: 0;
    left: 0;
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${props => 
      props.isHint 
        ? 'rgba(255, 152, 0, 0.7)' 
        : props.isSelected 
        ? 'rgba(33, 150, 243, 0.8)' 
        : props.highlightColor 
        ? `${props.highlightColor}77` 
        : 'rgba(255, 255, 255, 1)'
    };
    box-shadow: ${props => 
      props.isSelected 
        ? '0 0 20px rgba(33, 150, 243, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.8)' 
        : props.isHint 
        ? '0 0 20px rgba(255, 152, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.8)' 
        : props.highlightColor 
        ? `0 8px 20px ${props.highlightColor}55, inset 0 0 0 1px rgba(255, 255, 255, 0.8)` 
        : '0 8px 15px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
    };
  }
  
  &:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }
`;

const WordFoundNotification = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.color || 'rgba(76, 175, 80, 0.9)'};
  color: white;
  border-radius: 20px;
  padding: 20px 30px;
  font-size: 1.4rem;
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${floatAnimation} 2s ease-in-out;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 180px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  pointer-events: none; /* Prevents interaction with the notification */
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const NotificationWord = styled.div`
  font-weight: bold;
  font-size: 1.6rem;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
`;

const NotificationLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export default WordGrid; 