const MyButton = ({ type, text, onClick }) => {
  const btnType = ["positive", "negative"].includes(type) ? type : "default";

  return (
    /* className 배열로 작성하는 것 숙지 */
    <button
      className={["MyButton", `MyButton_${btnType}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default",
};

export default MyButton;
