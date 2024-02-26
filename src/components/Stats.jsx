function Stats({ type, streak, longestStreak }) {
  if (type === "start") {
    return (
      <p className="text-pink-500 text-lg font-semibold">
        Longest Streak✨{" "}
        <span className="text-pink-600 bg-purple-200 py px-3 rounded-md ml-1">
          {longestStreak}
        </span>
      </p>
    );
  }

  return (
    <div className="space-y-2 hdden">
      <p className="text-pink-500 text-lg font-semibold">
        Longest Streak✨{" "}
        <span className="text-pink-600 bg-purple-200 py px-3 rounded-md ml-1">
          {longestStreak}
        </span>
      </p>

      <p className="text-pink-500 text-lg font-semibold">
        Streak🔥{" "}
        <span className="text-pink-600 bg-purple-200 py px-3 rounded-md ml-1">
          {streak}
        </span>
      </p>
    </div>
  );
}

export default Stats;
