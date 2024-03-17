import { useEffect } from "react";

function Timer({ secondsRemaining, dispatch }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(timerId);
  }, [dispatch]);

  return (
    <div className="timer">
      <p>
        {minutes < 10 && "0"}
        {minutes}:{seconds < 10 && "0"}
        {seconds}
      </p>
    </div>
  );
}

export default Timer;
