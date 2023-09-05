import React, { useState } from "react";
import styles from "./Header.module.css";
import { useEmail, useToken } from "../../store/AuthContext";
import {useShowSearchResults, useToggleSearchResults, useUpdateSearchResults } from "../../store/UIContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const token = useToken();
  const email = useEmail();

  const setSearchResults = useUpdateSearchResults();
  const toggleSearchResults = useToggleSearchResults();
  const showSearchResults = useShowSearchResults();

  const logoutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };

  const goToHome = () => {
    navigate("/home")
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const searchDocuments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/documents/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ SearchQuery: searchQuery, email: email }),
          }
        );
        if (response.ok) {
          const searchResults = await response.json();
          setSearchResults(searchResults.documents);
        } else {
          console.error("Failed to fetch document:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
      }
    };
    searchDocuments();
    if (!showSearchResults) {
      toggleSearchResults();
    }
  };
  return (
    <div className={styles["header-container"]}>
      <h1 className={styles["company-name"]} onClick={goToHome}>MyDoc</h1>

      <div className={styles["search-container"]}>
        <input
          type="text"
          name="searchQuery"
          className={styles["search-input"]}
          placeholder="Search"
          required
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className={styles["search-icon"]} onClick={handleSearch}>
          <i className="bx bx-search bx-sm"></i>
        </button>
      </div>

      <div className={styles["logout-container"]}>
        <button className={styles["logout-btn"]} onClick={logoutHandler}>
        Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
