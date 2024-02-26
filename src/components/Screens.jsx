import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import ThemeButton from "./ThemeButton";
import Stats from "./Stats";
import flipSound from "../assets/sounds/card-flip.wav";
import error from "../assets/sounds/card-mismatch.wav";
import win from "../assets/sounds/card-match.wav";
import gameOver from "../assets/sounds/game-over.wav";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start, longestStreak }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Stats type="start" longestStreak={longestStreak} />

        <ThemeButton />
      </div>

      <div className="w-[400px] h-[400px] shadow-lg rounded-xl">
        <div className="bg-pink-100 h-full pt-20 items-center flex flex-col gap-7 rounded-xl dark:bg-slate-200 transition-all duration-500">
          <h1 className="font-bold text-4xl text-pink-500">Memory</h1>
          <p className="font-semibold text-pink-500 text-lg">
            Flip over tiles looking for pairs
          </p>
          <button
            onClick={start}
            className="bg-gradient-to-b from-pink-400 to-pink-600 text-white w-[130px] leading-none py-3 rounded-full text-xl font-semibold mt-4"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({
  end,
  currentStreak,
  setCurrentStreak,
  longestStreak,
  setLongestStreak,
}) {
  const [numPaired, setNumPaired] = useState(0);
  const [mute, setMute] = useState(
    localStorage.getItem("sound") === "mute" ?? false
  ); // first set the state to false when u are done u save it to localStorage
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const cardFlipSound = new Audio(flipSound);
  const cardMismatchSound = new Audio(error);
  const cardMatchSound = new Audio(win);
  const gameOverSound = new Audio(gameOver);

  function playSound(sound) {
    if (!mute) {
      sound.play();
    } else {
      sound.pause();
    }
  }

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      cardFlipSound.pause(); // on second card flip don't play sound
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        setCurrentStreak((prevStreak) => prevStreak + 1);
        setLongestStreak((prevLongestStreak) =>
          Math.max(prevLongestStreak, currentStreak + 1)
        );
        setNumPaired((paired) => paired + 1);
        playSound(cardMatchSound);
      }

      if (alreadyFlippedTile.content !== justFlippedTile.content) {
        setCurrentStreak(0);
        playSound(cardMismatchSound); // play mismatch sound when the second flipped card doesn't match
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
            localStorage.setItem("longest-streak", longestStreak);
            setCurrentStreak(0);
            playSound(gameOverSound); // play when all cards has been flipped
          }

          return newTiles;
        });
      }, 1000);
    } else {
      playSound(cardFlipSound); // play flip sound when first card is flipped
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Stats streak={currentStreak} longestStreak={longestStreak} />

        <div className="flex flex-col items-end gap-2">
          <button
            className="scale-125"
            onClick={() => {
              setMute((playsound) => !playsound);
              localStorage.setItem("sound", mute === true ? "unmute" : "mute");
            }}
          >
            {mute ? "🔇" : "🔊"}
          </button>

          <ThemeButton />
        </div>
      </div>

      <div className="flex gap-10 justify-center">
        <p className="texxt-center text-blue-500 text-[22px] font-semibold dark:text-blue-300 transition-all duration-500">
          Tries{" "}
          <span className="text-blue-600 bg-blue-200 py px-3 rounded-md ml-1 dark:bg-slate-300 transition-all duration-500">
            {tryCount}
          </span>
        </p>

        <p className="text-center text-blue-500 text-[22px] font-semibold dark:text-blue-300 transition-all duration-500">
          Paired{" "}
          <span className="text-blue-600 bg-blue-200 py px-3 rounded-md ml-1 dark:bg-slate-300 transition-all duration-500">
            {numPaired} of 8
          </span>
        </p>
      </div>

      <div className="w-[400px] h-[400px] bg-blue-100 rounded-xl shadow-lg dark:bg-slate-200 transition-all duration-500">
        <div className="flex justify-center items-center h-full">
          <div className="grid grid-cols-4 gap-4">
            {getTiles(16).map((tile, i) => (
              <Tile key={i} flip={() => flip(i)} {...tile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
