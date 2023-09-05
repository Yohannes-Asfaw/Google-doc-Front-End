import React, { useEffect, useState } from "react";
import styles from "./EditorHeader.module.css";
import EditDoc from "../Icons/EditDoc";
import { useNavigate, useParams } from "react-router-dom";
import {
  useIsOffline,
  useTitle,
  useTitleIsActive,
  useToggleOpen,
  useToggleTitleActive,
  useUpdateTitle,
} from "../../store/UIContext";
import { useAuthor, useEmail, useToken } from "../../store/AuthContext";
import { LockedFile } from "../Icons/LockedFile";
import { Offline } from "../Icons/Offline";
import { Sync } from "../Icons/Sync";

const EditorHeader = ({ isReadOnly }) => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const isOffline = useIsOffline();
  const title = useTitle();
  const author = useAuthor();
  const email = useEmail();
  const setTitle = useUpdateTitle();
  const titleIsActive = useTitleIsActive();
  const setTitleActive = useToggleTitleActive();
  const toggleModal = useToggleOpen();
  const token = useToken();

  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    // Reset newTitle when the title changes
    setNewTitle(title);
  }, [title]);

  const goToHome = () => {
    navigate("/home");
  };

  const handleUpdateTitle = () => {
    if (newTitle.trim() === "" || newTitle === title) {
      setTitleActive();
      return;
    }

    setTitle(newTitle);
    setTitleActive();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetch(`${BASE_URL}/documents/updatetitle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: documentId,
        updatedTitle: newTitle,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating document title:", error);
      });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  console.log("isReadOnly:", isReadOnly);
  console.log("email:", email);
  console.log("author:", author);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles["company-name"]} onClick={goToHome}>
          MyDoc
        </h1>
        <div className={styles.con}>
          {titleIsActive && (
            <input
              spellCheck="false"
              type="text"
              autoComplete="off"
              className={styles.title}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleUpdateTitle}
            />
          )}
          {!titleIsActive && (
            <input
              spellCheck="false"
              type="text"
              autoComplete="off"
              className={styles.title}
              value={title}
              readOnly
              onClick={setTitleActive}
              onSelect={setTitleActive}
            />
          )}
          {isReadOnly && (
            <p className={styles.readOnly}>
              read only <LockedFile />
            </p>
          )}
        </div>
        {isOffline === true ? (
          <div className={styles.gap}>
            <Offline />
            <div onClick={handleRefresh}>
              <Sync />
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.right}>
        {email === author && <EditDoc onClick={toggleModal} />}
      </div>
    </header>
  );
};

export default EditorHeader;
