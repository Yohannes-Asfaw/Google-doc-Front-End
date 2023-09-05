import React from 'react';
import styles from  './DocCard.module.css'; // Import the CSS file for styling

const DocumentCard = ({ name, imageUrl }) => {
  return (
    <div className={styles["document-card"]}>
      <img src={imageUrl} alt={name} className={styles["document-image"]} />
      <h3 className={styles["document-name"]}>{name}</h3>
    </div>
  );
};

export default DocumentCard;
