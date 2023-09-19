import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header";
import DocumentCard from "../../components/DocCard/DocCard";
import { useEmail, useToken } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateDoc from "../../components/Icons/CreateDoc";
import {
  useSearchResults,
  useShowSearchResults,
  useToggleSearchResults,
} from "../../store/UIContext";
import { Back } from "../../components/Icons/Back";

const Home = () => {
  const email = useEmail();
  const token = useToken();
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const showSearchResults = useShowSearchResults();
  const searchResults = useSearchResults();
  const toggleSearchResults = useToggleSearchResults();

  const goToHome = () => {
    toggleSearchResults();
  };

  const CreateNewDocument = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetch(`${BASE_URL}/documents/createnew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        author: email,
        title: "Untitled",
        body: "",
        access: [email],
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => navigate("/documents/" + data.document_id))
      .catch((error) => {
        console.error("Error creating document:", error);
      });
  };

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    if (email === null) return;
    fetch(`${BASE_URL}/documents/getall`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ email: email }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setDocuments(data.documents))
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [email, token]);

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles["document-container"]}>
        {/* Floating button for CreateDoc */}
        {!showSearchResults && (
          <button
            className={`${styles["noStyle"]} ${styles["floating-button"]}`}
            onClick={CreateNewDocument}
          >
            <CreateDoc />
          </button>
        )}

        {/* Document cards */}
        {!showSearchResults &&
          documents &&
          documents.map((doc) => (
            <button
              key={doc.id}
              className={styles["noStyle"]}
              onClick={() => navigate("/documents/" + doc.id)}
            >
              <DocumentCard
                onClick={() => navigate("/documents/" + doc.id)}
                key={doc.id}
                name={doc.title}
                imageUrl={
                  "https://cdn-icons-png.flaticon.com/512/281/281760.png"
                }
              />
            </button>
          ))}

        {/* Back button for search results */}
        <div>
          <div>
            {showSearchResults && (
              <button
                className={`${styles.back} ${styles.noStyle}`}
                onClick={goToHome}
              >
                <Back />
              </button>
            )}
          </div>
          {/* Search results */}
          <div>
            {!searchResults && showSearchResults && <p>No documents found</p>}
            {showSearchResults &&
              searchResults &&
              searchResults.map((doc) => (
                <button
                  key={doc.id}
                  className={styles["noStyle"]}
                  onClick={() => navigate("/documents/" + doc.id)}
                >
                  <DocumentCard
                    onClick={() => navigate("/documents/" + doc.id)}
                    key={doc.id}
                    name={doc.title}
                    imageUrl={
                      "https://cdn-icons-png.flaticon.com/512/281/281760.png"
                    }
                  />
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
