// AuthContext.js
import React, { useContext } from "react";

const UIContext = React.createContext({
  title: null,
  updateTitle: () => {},
  isTitleActive: false,
  toggleTitleActive: () => {},
  isOpen: false,
  toggleOpen: () => {},
  documentDetail: null,
  setDocumentDetail: () => {},
  readAccess: [],
  updateReadAccess: () => {},
  writeAccess: [],
  updateWriteAccess: () => {},
  searchResults: [],
  showSearchResults: false,
  toggleSearchResults: () => {},
  updateSearchResults: () => {},
  isOffline : false,
  toggleOffline : () => {},
});

export function useTitle() {
  return useContext(UIContext).title;
}

export function useUpdateTitle() {
  return useContext(UIContext).updateTitle;
}

export function useTitleIsActive() {
  return useContext(UIContext).isTitleActive;
}

export function useToggleTitleActive() {
  return useContext(UIContext).toggleTitleActive;
}

export function useIsOpen() {
  return useContext(UIContext).isOpen;
}

export function useToggleOpen() {
  return useContext(UIContext).toggleOpen;
}

export function useDocumentDetail() {
  return useContext(UIContext).documentDetail;
}

export function useSetDocumentDetail() {
  return useContext(UIContext).setDocumentDetail;
}

export function useReadAccess() {
  return useContext(UIContext).readAccess;
}

export function useUpdateReadAccess() {
  return useContext(UIContext).updateReadAccess;
}

export function useWriteAccess() {
  return useContext(UIContext).writeAccess;
}

export function useUpdateWriteAccess() {
  return useContext(UIContext).updateWriteAccess;
}

export function useSearchResults() {
  return useContext(UIContext).searchResults;
}

export function useShowSearchResults() {
  return useContext(UIContext).showSearchResults;
}

export function useToggleSearchResults() {
  return useContext(UIContext).toggleSearchResults;
}

export function useUpdateSearchResults() {
  return useContext(UIContext).updateSearchResults;
}

export function useIsOffline() {
  return useContext(UIContext).isOffline;
}

export function useToggleOffline() {
  return useContext(UIContext).toggleOffline;
}

export function UIContextProvider({ children }) {
  const [title, setTitle] = React.useState("");
  const [isTitleActive, setIsTitleActive] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [documentDetail, setDocumentDetail] = React.useState(null);
  const [readAccess, setReadAccess] = React.useState([]);
  const [writeAccess, setWriteAccess] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  const updateTitle = (value) => {
    setTitle((prevState) => value);
  };

  const toggleTitleActive = () => {
    setIsTitleActive((prevState) => !prevState);
  };

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const updateDocumentDetail = (value) => {
    setDocumentDetail((prevState) => value);
  };

  const updateReadAccess = (value, action) => {
    if (action === "add") {
      setReadAccess((prevState) => [...prevState, value]);
    } else if (action === "remove") {
      setReadAccess((prevState) => prevState.filter((id) => id !== value));
    }
  };

  const updateWriteAccess = (value, action) => {
    if (action === "add") {
      setWriteAccess((prevState) => [...prevState, value]);
    } else if (action === "remove") {
      setWriteAccess((prevState) => prevState.filter((id) => id !== value));
    }
  };

  const toggleSearchResults = () => {
    setShowSearchResults((prevState) => !prevState);
  };

  const updateSearchResults = (value) => {
    setSearchResults((prevState) => value);
  };

  const toggleOffline = (value) => {
    setIsOffline((prevState) => value);
  }

  return (
    <UIContext.Provider
      value={{
        title: title,
        updateTitle: updateTitle,
        isTitleActive: isTitleActive,
        toggleTitleActive: toggleTitleActive,
        isOpen: isOpen,
        toggleOpen: toggleOpen,
        documentDetail: documentDetail,
        setDocumentDetail: updateDocumentDetail,
        readAccess: readAccess,
        updateReadAccess: updateReadAccess,
        writeAccess: writeAccess,
        updateWriteAccess: updateWriteAccess,
        searchResults: searchResults,
        showSearchResults: showSearchResults,
        toggleSearchResults: toggleSearchResults,
        updateSearchResults: updateSearchResults,
        isOffline: isOffline,
        toggleOffline: toggleOffline,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
