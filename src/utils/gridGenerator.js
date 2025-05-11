// Function to generate a random letter grid with placed words
export const generateWordGrid = (words, gridSize, difficulty = 'easy') => {
  // Create empty grid
  const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  const placedWords = [];

  // Sort words by length (longer first)
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

  // Place each word on the grid
  for (const wordObj of sortedWords) {
    const word = wordObj.word.toUpperCase();
    
    // Skip if word is too long for the grid
    if (word.length > gridSize) {
      continue;
    }
    
    // Try to place the word multiple times
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Random starting position
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      
      // Random direction - based on difficulty
      let directions = [];
      if (difficulty === 'easy') {
        // Only horizontal and vertical for easy levels
        directions = ['right', 'down'];
      } else {
        // All directions for harder levels
        directions = ['right', 'down', 'up', 'left', 'down-right', 'down-left', 'up-right', 'up-left'];
      }
      
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      if (canPlaceWord(grid, word, row, col, direction, gridSize)) {
        placeWord(grid, word, row, col, direction);
        placedWords.push({
          ...wordObj,
          position: { row, col, direction }
        });
        placed = true;
      }
    }
  }
  
  // Fill empty cells with random letters
  fillEmptyCells(grid);
  
  return { grid, placedWords };
};

// Helper function to check if a word can be placed at a position
function canPlaceWord(grid, word, row, col, direction, gridSize) {
  const directionOffsets = getDirectionOffsets(direction);
  const [rowOffset, colOffset] = directionOffsets;
  
  // Check if word fits
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * rowOffset;
    const newCol = col + i * colOffset;
    
    // Check boundaries
    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
      return false;
    }
    
    // Check if cell is empty or has the same letter
    if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

// Helper function to place a word on the grid
function placeWord(grid, word, row, col, direction) {
  const directionOffsets = getDirectionOffsets(direction);
  const [rowOffset, colOffset] = directionOffsets;
  
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * rowOffset;
    const newCol = col + i * colOffset;
    
    grid[newRow][newCol] = word[i];
  }
}

// Helper function to get direction offsets
function getDirectionOffsets(direction) {
  switch (direction) {
    case 'right': return [0, 1];
    case 'left': return [0, -1];
    case 'down': return [1, 0];
    case 'up': return [-1, 0];
    case 'down-right': return [1, 1];
    case 'down-left': return [1, -1];
    case 'up-right': return [-1, 1];
    case 'up-left': return [-1, -1];
    default: return [0, 1]; // Default to right
  }
}

// Helper function to fill empty cells with random letters
function fillEmptyCells(grid) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === '') {
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        grid[i][j] = randomLetter;
      }
    }
  }
} 