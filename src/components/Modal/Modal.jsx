import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import { Close } from "../Icons/Close";


export default function Modal({ isOpen, childern, onClose }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose}/>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles["no-style"]}>
          <Close />
        </button>
        {childern}
      </div>
    </>,
    document.getElementById("portal")
  );
}
