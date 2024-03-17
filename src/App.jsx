import { useEffect, useReducer } from "react";

import Main from "./Main";
import Error from "./Error";
import Timer from "./Timer";
import Header from "./Header";
import Loader from "./Loader";
import Footer from "./Footer";
import Progress from "./Progress";
import Question from "./Question";
import NextButton from "./NextButton";
import StartScreen from "./StartScreen";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  status: "loading",
  qIdx: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECONDS_PER_QUESTION = 30;

function reducer(state, { type, payload }) {
  switch (type) {
    case "dataReceived":
      return {
        ...state,
        questions: payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer": {
      const currentQuestion = state.questions.at(state.qIdx);
      const pointsToInc =
        payload === currentQuestion.correctOption ? currentQuestion.points : 0;

      return {
        ...state,
        answer: payload,
        points: state.points + pointsToInc,
      };
    }
    case "nextQuestion":
      return { ...state, qIdx: state.qIdx + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        answer: null,
        highScore: Math.max(state.highScore, state.points),
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Invalid type");
  }
}

function App() {
  const [
    { status, questions, qIdx, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();

        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen count={questions.length} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={qIdx}
              numQuestions={questions.length}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions.at(qIdx)}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <NextButton
                answer={answer}
                index={qIdx}
                numQuestions={questions.length}
                dispatch={dispatch}
              />
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
