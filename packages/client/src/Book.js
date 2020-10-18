import React from "react";

const convertToRandomObject = (title) => {
  return {
    type: "Title",
    title: title,
  };
};

const BookTitle = ({ object }) => {
  return <p>{object.title}</p>;
};

export const Book = ({ book, onEdit }) => {
  const [value, setValue] = React.useState("");

  const handleClick = () => {
    onEdit(book.id, value);
    setValue("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: 1 }}>
        <BookTitle object={convertToRandomObject(book.title)} />
      </div>
      <div style={{ flex: 1 }}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={handleClick}>Mjuokkaa</button>
      </div>
    </div>
  );
};
