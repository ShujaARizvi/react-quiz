function Question({ question, answer, dispatch }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} answer={answer} dispatch={dispatch} />
    </div>
  );
}

function Options({ question, answer, dispatch }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((op, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={op}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          disabled={hasAnswered}
        >
          {op}
        </button>
      ))}
    </div>
  );
}

export default Question;
