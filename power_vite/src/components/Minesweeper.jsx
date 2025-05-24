import React, { useState, useEffect, useRef, useCallback } from 'react';

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [level, setLevel] = useState(10);
  const [grid, setGrid] = useState([]); 
  const [gameData, setGameData] = useState({
    rowCount: 10,
    colCount: 10,
    landMineCount: 10,
    markLandMineCount: 0,
    currentStepCount: 0,
    beginTime: null,
    endTime: null
  });

  // ゲームの状態定数
  const GAME_STATES = {
    MENU: 'menu',
    READY: 'ready',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    GAME_CLEAR: 'gameClear',
  };

  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const timerRef = useRef(null);

  // 難易度選択コンポーネント
  const DifficultySelector = ({ selected, setSelected }) => {
    const options = [
      { label: "初級", value: "easy", desc: "10×10 地雷10個" },
      { label: "中級", value: "normal", desc: "15×15 地雷40個" },
      { label: "上級", value: "hard", desc: "20×20 地雷100個" }
    ];

    return (
      <div>
        {options.map((option) => (
          <div key={option.value} className="level-option">
            <input
              type="radio"
              value={option.value}
              checked={selected === option.value}
              onChange={() => setSelected(option.value)}
            />
            <label>
              <strong>{option.label}</strong><br/>
              <small>{option.desc}</small>
            </label>
          </div>
        ))}
      </div>
    );
  };

  // ヘルプモーダルコンポーネント
  const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>🎮 マインスイーパーの遊び方</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="help-section">
              <h4>📋 基本ルール</h4>
              <ul>
                <li>盤面に隠された地雷を踏まずに、すべての安全なマスを開けばクリア</li>
                <li>数字は周囲8マスの地雷の数を示しています</li>
                <li>地雷のあるマスをクリックするとゲームオーバー</li>
              </ul>
            </div>
            
            <div className="help-section">
              <h4>🖱️ 操作方法</h4>
              <ul>
                <li><strong>左クリック:</strong> マスを開く</li>
                <li><strong>右クリック:</strong> 地雷だと思うマスにフラグ🚩を立てる</li>
                <li>フラグの立ったマスは開けません（誤クリック防止）</li>
              </ul>
            </div>

            <div className="help-section">
              <h4>💡 攻略のコツ</h4>
              <ul>
                <li>角や端から始めると安全</li>
                <li>数字の周りの地雷数と既に立てたフラグ数を数える</li>
                <li>確実に安全なマスから順番に開く</li>
                <li>分からない時は論理的に推理しよう</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 初期化
  const initGame = useCallback((rowCount, colCount, landMineCount) => {
    const newGrid = Array(rowCount).fill().map(() =>
      Array(colCount).fill().map(() => ({
        value: 0,
        revealed: false,
        flagged: false,
        id: Math.random().toString(36)
      }))
    );

    setGrid(newGrid);
    setGameData({
      rowCount,
      colCount,
      landMineCount,
      markLandMineCount: 0,
      currentStepCount: 0,
      beginTime: null,
      endTime: null
    });
    setHasGameStarted(false);
    setElapsedTime(0);
    setScore(0);
  }, []);

  // 地雷を配置
  const placeLandMines = useCallback((grid, landMineCount, firstClickRow, firstClickCol) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const rowCount = grid.length;
    const colCount = grid[0].length;
    const totalCells = rowCount * colCount;

    // 除外する周囲9マス（クリック位置含む）
    const excludedIndices = new Set();

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = firstClickRow + dr;
        const c = firstClickCol + dc;
        if (r >= 0 && r < rowCount && c >= 0 && c < colCount) {
          excludedIndices.add(r * colCount + c);
        }
      }
    }

    // 地雷を置く候補のインデックスを作成
    const candidates = [];
    for (let i = 0; i < totalCells; i++) {
      if (!excludedIndices.has(i)) {
        candidates.push(i);
      }
    }

    // シャッフルして地雷を選ぶ（Fisher-Yates）
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const selected = candidates.slice(0, landMineCount);

    // 地雷を配置
    selected.forEach(index => {
      const row = Math.floor(index / colCount);
      const col = index % colCount;
      newGrid[row][col].value = 9;
    });

    return newGrid;
  }, []);

  // 周辺の地雷数を計算
  const calculateNumbers = useCallback((grid) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const rowCount = newGrid.length;
    const colCount = newGrid[0].length;

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        if (newGrid[i][j].value === 9) continue;

        let count = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < rowCount && nj >= 0 && nj < colCount) {
              if (newGrid[ni][nj].value === 9) count++;
            }
          }
        }
        newGrid[i][j].value = count;
      }
    }

    return newGrid;
  }, []);

  // セルを開く
  const revealCell = useCallback((row, col) => {
    if (gameState !== GAME_STATES.PLAYING && !hasGameStarted) {
      // 最初のクリック - ゲームを開始
      setHasGameStarted(true);
      setGameState(GAME_STATES.PLAYING);
      
      // 地雷を配置
      let newGrid = placeLandMines(grid, gameData.landMineCount, row, col);
      newGrid = calculateNumbers(newGrid);
      
      setGrid(newGrid);
      setGameData(prev => ({ ...prev, beginTime: new Date() }));

      // タイマー開始
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      // 最初のセルを開く
      setTimeout(() => {
        revealCellAfterSetup(newGrid, row, col);
      }, 0);
      
      return;
    }

    if (gameState !== GAME_STATES.PLAYING) return;

    revealCellAfterSetup(grid, row, col);
  }, [gameState, hasGameStarted, grid, gameData, placeLandMines, calculateNumbers]);

  const revealCellAfterSetup = (currentGrid, row, col) => {
    setGrid(prevGrid => {
      const newGrid = currentGrid.map ? currentGrid.map(r => r.map(c => ({ ...c }))) : prevGrid.map(r => r.map(c => ({ ...c })));
      
      if (newGrid[row][col].revealed || newGrid[row][col].flagged) return prevGrid;

      if (newGrid[row][col].value === 9) {
        // 地雷を踏んだ
        clearInterval(timerRef.current);
        setGameState(GAME_STATES.GAME_OVER);
        setGameData(prev => ({ ...prev, endTime: new Date() }));
        
        // すべての地雷を表示
        for (let i = 0; i < gameData.rowCount; i++) {
          for (let j = 0; j < gameData.colCount; j++) {
            if (newGrid[i][j].value === 9) {
              newGrid[i][j].revealed = true;
            }
          }
        }
        return newGrid;
      }

      // セルを開く
      const openCells = (r, c) => {
        if (r < 0 || r >= gameData.rowCount || c < 0 || c >= gameData.colCount) return;
        if (newGrid[r][c].revealed || newGrid[r][c].flagged) return;

        newGrid[r][c].revealed = true;

        if (newGrid[r][c].value === 0) {
          // 空のセルの場合、周辺も開く
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              openCells(r + di, c + dj);
            }
          }
        }
      };

      openCells(row, col);

      // 勝利判定
      let revealedCount = 0;
      for (let i = 0; i < gameData.rowCount; i++) {
        for (let j = 0; j < gameData.colCount; j++) {
          if (newGrid[i][j].revealed) revealedCount++;
        }
      }

      if (revealedCount === gameData.rowCount * gameData.colCount - gameData.landMineCount) {
        clearInterval(timerRef.current);
        setGameState(GAME_STATES.GAME_CLEAR);
        setGameData(prev => ({ ...prev, endTime: new Date() }));
        
        // スコア計算: 経過時間 × 2500 - 基準値
        const baseScores = {
          easy: 200,
          normal: 500,
          hard: 1000
        };
        const calculatedScore = Math.max(0, Math.round(elapsedTime * 2500 - baseScores[difficulty]));
        setScore(calculatedScore);
      }

      return newGrid;
    });
  };

  // フラグの切り替え
  const toggleFlag = useCallback((row, col) => {
    if (gameState !== GAME_STATES.PLAYING) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => r.map(c => ({ ...c })));

      if (newGrid[row][col].revealed) return prevGrid;

      newGrid[row][col].flagged = !newGrid[row][col].flagged;

      setGameData(prev => ({
        ...prev,
        markLandMineCount: prev.markLandMineCount + (newGrid[row][col].flagged ? 1 : -1)
      }));

      return newGrid;
    });
  }, [gameState]);

  // 右クリック処理
  const handleRightClick = useCallback((e, row, col) => {
    e.preventDefault();
    toggleFlag(row, col);
  }, [toggleFlag]);

  // レベル変更時の初期化
  useEffect(() => {
    const configs = {
      easy: { size: 10, mines: 10 },
      normal: { size: 15, mines: 40 },
      hard: { size: 20, mines: 100 }
    };
    
    const config = configs[difficulty];
    setLevel(config.size);
    initGame(config.size, config.size, config.mines);
  }, [difficulty, initGame]);

  // ゲーム開始（メニューから）
  const startGame = () => {
    setGameState(GAME_STATES.READY);
  };

  // ゲーム再開
  const restartGame = () => {
    clearInterval(timerRef.current);
    setGameState(GAME_STATES.MENU);
    setElapsedTime(0);
    setScore(0);
    setHasGameStarted(false);
    
    // 盤面を完全に初期化
    const { rowCount, colCount, landMineCount } = gameData;
    initGame(rowCount, colCount, landMineCount);
  };

  // セルの表示内容
  const getCellContent = (cell) => {
    if (!cell.revealed && cell.flagged) return '🚩';
    if (!cell.revealed) return '';
    if (cell.value === 9) return '💣';
    if (cell.value === 0) return '';
    return cell.value;
  };

  // セルのスタイル
  const getCellClassName = (cell) => {
    let className = 'cell ';
    if (cell.revealed) {
      className += cell.value === 9 ? 'mine ' : 'revealed ';
    } else {
      className += 'hidden ';
    }
    if (cell.flagged) className += 'flagged ';
    return className;
  };

  // 難易度ラベル
  const difficultyLabels = {
    easy: "初級",
    normal: "中級", 
    hard: "上級"
  };

  return (
    <div className="minesweeper-game">
      <style jsx>{`
        .minesweeper-game {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
        }

        .scene {
          display: none;
          text-align: center;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          margin: 20px 0;
        }

        .scene.active {
          display: block;
        }

        .menu-scene {
          max-width: 400px;
          margin: 0 auto;
        }

        .difficulty-selection {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }

        .difficulty-selection legend {
          color: white;
          font-weight: bold;
          font-size: 18px;
          padding: 0 10px;
        }

        .level-option {
          display: flex;
          align-items: flex-start;
          margin: 15px 0;
          font-size: 16px;
          text-align: left;
        }

        .level-option input {
          margin-right: 15px;
          margin-top: 2px;
          transform: scale(1.2);
        }

        .level-option label {
          cursor: pointer;
        }

        .level-option small {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }

        .start-button, .restart-button {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          border: none;
          color: white;
          padding: 15px 30px;
          font-size: 18px;
          font-weight: bold;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 20px 10px;
        }

        .help-button {
          background: linear-gradient(45deg, #54a0ff, #2e86de);
          border: none;
          color: white;
          padding: 12px 25px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 10px;
        }

        .start-button:hover, .restart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .help-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .game-board {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 15px;
          margin: 20px 0;
        }

        .grid {
          display: grid;
          gap: 2px;
          grid-template-columns: repeat(${gameData.colCount}, 30px);
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 5px;
          background: rgba(0, 0, 0, 0.2);
        }

        .cell {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.1s ease;
          user-select: none;
        }

        .cell.hidden {
          background: linear-gradient(145deg, #a8a8a8, #8c8c8c);
          border: 1px solid #666;
        }

        .cell.hidden:hover {
          background: linear-gradient(145deg, #b8b8b8, #9c9c9c);
        }

        .cell.revealed {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ccc;
        }

        .cell.mine {
          background: #ff4757;
          color: white;
        }

        .cell.flagged {
          background: linear-gradient(145deg, #ffa502, #ff7675);
        }

        .game-info {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 16px;
        }

        .info-value {
          font-size: 24px;
          font-weight: bold;
          margin-top: 5px;
        }

        .end-screen {
          text-align: center;
          padding: 60px 20px;
        }

        .end-screen h2 {
          font-size: 48px;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .game-over {
          color: #ff4757;
        }

        .game-clear {
          color: #2ed573;
        }

        .score-display {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
          padding: 20px;
          border-radius: 15px;
          margin: 30px 0;
          font-size: 28px;
          font-weight: bold;
          text-shadow: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 0;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .modal-header {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 15px 15px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          padding: 30px;
        }

        .help-section {
          margin-bottom: 25px;
        }

        .help-section h4 {
          color: #ffd700;
          margin-bottom: 10px;
          font-size: 18px;
        }

        .help-section ul {
          text-align: left;
          padding-left: 20px;
        }

        .help-section li {
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .help-section p {
          text-align: left;
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .game-tips {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: left;
        }

        .tip-highlight {
          background: rgba(255, 215, 0, 0.2);
          padding: 2px 5px;
          border-radius: 3px;
          font-weight: bold;
        }

        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(${gameData.colCount}, 25px);
          }
          
          .cell {
            width: 25px;
            height: 25px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* メニュー画面 */}
      <div className={`scene menu-scene ${gameState === GAME_STATES.MENU ? 'active' : ''}`}>
        <h1 style={{ fontSize: '36px', marginBottom: '30px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          💣 マインスイーパー
        </h1>
        
        <fieldset className="difficulty-selection">
          <legend>難易度選択</legend>
          <DifficultySelector selected={difficulty} setSelected={setDifficulty}/>
        </fieldset>

        <button className="start-button" onClick={startGame}>
          🚀 ゲームスタート
        </button>
        
        <button className="help-button" onClick={() => setShowHelp(true)}>
          ❓ 遊び方
        </button>
      </div>

      {/* ゲーム画面 */}
      <div className={`scene ${(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.READY) ? 'active' : ''}`}>
        <div className="game-info">
          <div className="info-item">
            <div>💣 残り地雷</div>
            <div className="info-value">{gameData.landMineCount - gameData.markLandMineCount}</div>
          </div>
          <div className="info-item">
            <div>⏱️ 経過時間</div>
            <div className="info-value">{elapsedTime}s</div>
          </div>
          <div className="info-item">
            <div>🎯 難易度</div>
            <div className="info-value">{difficultyLabels[difficulty]}</div>
          </div>
        </div>

        <div className="game-board">
          <div className="grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClassName(cell)}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                >
                  {getCellContent(cell)}
                </div>
              ))
            )}
          </div>
        </div>

        {gameState === GAME_STATES.READY && (
          <div className="game-tips">
            <p><strong>💡 ゲーム開始のヒント:</strong></p>
            <p>セルをクリックしてゲームを開始してください。最初のクリックは必ず安全です！</p>
            <p><span className="tip-highlight">右クリック</span>でフラグを立てて地雷をマークできます。</p>
          </div>
        )}
      </div>

      {/* ゲームオーバー画面 */}
      <div className={`scene end-screen ${gameState === GAME_STATES.GAME_OVER ? 'active' : ''}`}>
        <h2 className="game-over">💥 ゲームオーバー</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          プレイ時間: {elapsedTime}秒<br/>
          難易度: {difficultyLabels[difficulty]}
        </p>
        <button className="restart-button" onClick={restartGame}>
          🔄 もう一度
        </button>
      </div>

      {/* ゲームクリア画面 */}
      <div className={`scene end-screen ${gameState === GAME_STATES.GAME_CLEAR ? 'active' : ''}`}>
        <h2 className="game-clear">🎉 ゲームクリア！</h2>
        <div className="score-display">
          🏆 スコア: {score.toLocaleString()}点
        </div>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          クリア時間: {elapsedTime}秒<br/>
          難易度: {difficultyLabels[difficulty]}
        </p>
        <button className="restart-button" onClick={restartGame}>
          🔄 もう一度
        </button>
      </div>

      {/* ヘルプモーダル */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default Minesweeper;