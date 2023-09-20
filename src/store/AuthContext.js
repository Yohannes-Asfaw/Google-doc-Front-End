// AuthContext.js
import React, { useContext } from "react";

const AuthContext = React.createContext({
  email: null,
  updateEmail: () => {},
  token: null,
  updateToken: () => {},
  author: null,
  updateAuthor: () => {},
});

export function useEmail() {
  return useContext(AuthContext).email;
}

export function useUpdateEmail() {
  return useContext(AuthContext).updateEmail;
}

export function useToken() {
  return useContext(AuthContext).token;
}

export function useUpdateToken() {
  return useContext(AuthContext).updateToken;
}

export function useAuthor() {
  return useContext(AuthContext).author;
}

export function useUpdateAuthor() {
  return useContext(AuthContext).updateAuthor;
}

export function AuthContextProvider({ children }) {
  const [email, setEmail] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [author, setAuthor] = React.useState(null);

  const updateEmail = (email) => {
    setEmail(email);
  };

  const updateToken = (token) => {
    setToken(token);
  };

  const updateAuthor = (author) => {
    setAuthor(author);
  };


  return (
    <AuthContext.Provider
      value={{
        email,
        updateEmail,
        token,
        updateToken,
        author,
        updateAuthor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
