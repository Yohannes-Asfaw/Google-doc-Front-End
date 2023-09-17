// DocDetailPage.js

import React, { useCallback, useEffect, useState } from "react";
import styles from "./EditDocDetail.module.css"; // Import the CSS file for styling
import ListItem from "../../components/ListItem/ListItem";
import { useEmail, useToken } from "../../store/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReadAccess,
  useToggleOpen,
  useUpdateReadAccess,
  useUpdateWriteAccess,
  useWriteAccess,
} from "../../store/UIContext";

const EditDocDetail = () => {
  const email = useEmail();
  const token = useToken();
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [newReader, setNewReader] = useState("");
  const [newWriter, setNewWriter] = useState("");

  // const readAccess = localStorage.getItem("readAccess").split(",");
  // const writeAccess = localStorage.getItem("writeAccess").split(",");
  // const [read, setRead] = useState(readAccess);
  // const [write, setWrite] = useState(writeAccess);
  const read = useReadAccess();
  const write = useWriteAccess();
  const setRead = useUpdateReadAccess();
  const setWrite = useUpdateWriteAccess();
  const closeModal = useToggleOpen();

  useEffect(() => {
    console.log("useEffect is running");
    const initialRead = localStorage.getItem("readAccess").split(",");
    const initialWrite = localStorage.getItem("writeAccess").split(",");
    if (read.length === 0 && write.length === 0) {
      for (let i = 0; i < initialRead.length; i++) {
        setRead(initialRead[i], "add");
      }
      for (let i = 0; i < initialWrite.length; i++) {
        setWrite(initialWrite[i], "add");
      }
    }
  }, []);

  const handleReaderInputChange = (e) => {
    setNewReader(e.target.value);
  };
  const handleWriterInputChange = (e) => {
    setNewWriter(e.target.value);
  };

  const updateCollaborators = useCallback(() => {
    const currentRead = read; 
    const currentWrite = write;
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetch(`${BASE_URL}/documents/updatecollaborators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        document_id: documentId,
        readAccess: currentRead,
        writeAccess: currentWrite,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error updating collaborators:", error);
      });
  });

  useEffect(() => {
    updateCollaborators();
  }, [read, write, updateCollaborators]);

  const addReadCollaborator = (user) => {
    if (read.includes(user)) return;
    setRead(user, "add");
    updateCollaborators();
    setNewReader("");
  };
  const removeReadCollaborator = (user) => {
    setRead(user, "remove");
    updateCollaborators();
  };
  const addWriteCollaborator = (user) => {
    if (write.includes(user)) return;
    setWrite(user, "add");
    setNewWriter("");
    updateCollaborators();
  };
  const removeWriteCollaborator = (user) => {
    setWrite(user, "remove");
    updateCollaborators();
  };

  const deleteDocument = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetch(`${BASE_URL}/documents/delete/${documentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        if (res.ok) {
          closeModal();
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
  };

  return (
    <div className={styles.container}>
      <h2>Users with read access</h2>
      <div className={styles["add-permissions"]}>
        <input
          type="text"
          placeholder="Add Collaborator"
          onChange={handleReaderInputChange}
          value={newReader}
        />
        <button onClick={() => addReadCollaborator(newReader.trim())}>
        <i className="bx bx-plus bx-sm"></i>
        </button>
      </div>
      <div className={styles.read}>
        {read.map((user) =>
          user !== email ? (
            <ListItem
              key={user}
              user={user}
              onClick={() => removeReadCollaborator(user.trim())}
            />
          ) : (
            <ListItem key={"You"} user={"You"} />
          )
        )}
      </div>
      <h2>Users with write access</h2>
      <div className={styles["add-permissions"]}>
        <input
          type="text"
          placeholder="Add Collaborator"
          onChange={handleWriterInputChange}
          value={newWriter}
        />
        <button onClick={() => addWriteCollaborator(newWriter.trim())}>
        <i className="bx bx-plus bx-sm"></i>
        </button>
      </div>
      <div className={styles.write}>
        {write.map((user) =>
          user !== email ? (
            <ListItem
              key={user}
              user={user}
              onClick={() => removeWriteCollaborator(user.trim())}
            />
          ) : (
            <ListItem key={"You"} user={"You"} />
          )
        )}
      </div>
      <button
        className={styles["delete-btn"]}
        onClick={() => deleteDocument(documentId)}
      >
        Delete document
      </button>
    </div>
  );
};

export default EditDocDetail;
