import React from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Book } from "./Book";

const GET_BOOKS = gql`
  query Books($max: Int!) {
    books {
      id
      title
    }

    randomBooks(max: $max) {
      id
      title
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($book: BookInput!) {
    addBook(book: $book) {
      id
      title
    }
  }
`;

const EDIT_BOOK = gql`
  mutation EditBook($id: ID!, $book: BookInput!) {
    editBook(id: $id, book: $book) {
      id
      title
    }
  }
`;

function App() {
  const { data: books } = useQuery(GET_BOOKS, {
    variables: { max: 5 },
    onError: (err) => console.log(err),
  });

  const [addBook] = useMutation(ADD_BOOK, {
    onCompleted: (data) => console.log("Added", data.addBook.title),
    onError: (err) => console.log(err),
    update: (cache, { data }) => {
      console.log(data);
      cache.modify({
        fields: {
          books(existingBooksRef = [], { readField }) {
            const newBookRef = cache.writeFragment({
              data: data.addBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  title
                }
              `,
            });

            // Quick safety check - if the new comment is already
            // present in the cache, we don't need to add it again.
            if (
              existingBooksRef.some(
                (ref) => readField("id", ref) === newBookRef.id
              )
            ) {
              return newBookRef;
            }

            return [...existingBooksRef, newBookRef];
          },
        },
      });
    },
  });

  const [editBook] = useMutation(EDIT_BOOK, {
    onCompleted: (data) => console.log("Edited", data.editBook),
    onError: (err) => console.log("err", err),
    update: (cache) => console.log(cache),
  });

  const [value, setValue] = React.useState("");

  const handleEdit = (id, title) => {
    const book = { title: title };

    editBook({
      variables: { id, book },
    });
  };

  const handleAdd = () => {
    addBook({ variables: { book: { title: value } } });
    setValue("");
  };

  if (!books) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ padding: 20 }}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={handleAdd}>Lisää</button>
      </div>
      <div style={{ width: "50%" }}>
        <h1>Good ol' list of books</h1>

        {books.books.map((book, index) => (
          <Book key={`book-${index}`} book={book} onEdit={handleEdit} />
        ))}
      </div>
      {books.randomBooks && (
        <div style={{ width: "50%" }}>
          <h1>Random books</h1>
          {books.randomBooks.map((book, index) => (
            <Book key={`random-${index}`} book={book} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
