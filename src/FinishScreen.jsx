function FinishScreen({ points, maxPoints, highScore, dispatch }) {
  const scorePct = Math.ceil((points / maxPoints) * 100);

  let emoji;
  if (scorePct === 100) emoji = "🥇";
  if (scorePct >= 80) emoji = "🎉";
  if (scorePct >= 50) emoji = "😊";
  if (scorePct > 0) emoji = "🤔";
  if (scorePct === 0) emoji = "🤦🏻‍♂️";

  return (
    <>
      <p className="result">
        {emoji} You scored <strong>{points}</strong> out of {maxPoints} (
        {scorePct}%)
      </p>

      <p className="highscore">Highscore: {highScore} points</p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
