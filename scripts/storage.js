/**
 * Storage Module for Game Portfolio
 * Handles saving and retrieving scores from LocalStorage
 */

const STORAGE_KEY_PREFIX = 'game_portfolio_';

const StorageManager = {
  /**
   * Save a score for a specific game
   * @param {string} gameId - The unique ID of the game (e.g., 'rps', 'memory')
   * @param {number} score - The score to save
   * @param {boolean} isHigherBetter - True if higher score is better (default), False if lower (like time)
   */
  saveScore: (gameId, score, isHigherBetter = true) => {
    const key = `${STORAGE_KEY_PREFIX}${gameId}_highscore`;
    const currentHigh = localStorage.getItem(key);

    let isNewRecord = false;

    if (currentHigh === null) {
      isNewRecord = true;
    } else {
      const current = parseFloat(currentHigh);
      if (isHigherBetter) {
        if (score > current) isNewRecord = true;
      } else {
        if (score < current) isNewRecord = true;
      }
    }

    if (isNewRecord) {
      localStorage.setItem(key, score);
    }

    // Also update match history for total played
    StorageManager.updateMatchHistory(gameId, score);

    return isNewRecord;
  },

  /**
   * Get the high score for a game
   * @param {string} gameId
   * @returns {number|null}
   */
  getHighScore: (gameId) => {
    const key = `${STORAGE_KEY_PREFIX}${gameId}_highscore`;
    return localStorage.getItem(key);
  },

  /**
   * Update match history (Total played)
   */
  updateMatchHistory: (gameId, lastScore) => {
    const key = `${STORAGE_KEY_PREFIX}${gameId}_history`;
    const historyStr = localStorage.getItem(key);
    let history = historyStr ? JSON.parse(historyStr) : { played: 0, lastScore: 0 };

    history.played += 1;
    history.lastScore = lastScore;

    localStorage.setItem(key, JSON.stringify(history));
  },

  /**
   * Get basic stats
   */
  getStats: (gameId) => {
    const key = `${STORAGE_KEY_PREFIX}${gameId}_history`;
    const historyStr = localStorage.getItem(key);
    return historyStr ? JSON.parse(historyStr) : { played: 0, lastScore: 0 };
  },

  /**
   * Save Username
   */
  setUsername: (name) => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}username`, name);
  },

  getUsername: () => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}username`) || 'Player 1';
  }
};

// Expose to window for global access in vanilla JS pages
window.StorageManager = StorageManager;
