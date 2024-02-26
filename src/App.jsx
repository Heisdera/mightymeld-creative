import { useState } from "react";
import { StartScreen, PlayScreen } from "./components/Screens";

function App() {
  const [gameState, setGameState] = useState("start");
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(
    localStorage.getItem("longest-streak") || 0
  );

  switch (gameState) {
    case "start":
      return (
        <StartScreen
          start={() => setGameState("play")}
          longestStreak={longestStreak}
        />
      );
    case "play":
      return (
        <PlayScreen
          end={() => setGameState("start")}
          currentStreak={currentStreak}
          setCurrentStreak={setCurrentStreak}
          longestStreak={longestStreak}
          setLongestStreak={setLongestStreak}
        />
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
