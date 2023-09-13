import Remove from "../Icons/Remove";
import styles from "./ListItem.module.css";

export default function ListItem({ user, onClick }) {
  return (
    <li className={styles.li}>
      <p>{user}</p>
      {user === "You" ? null : <Remove onClick={() => onClick(user)} />}
    </li>
  );
}
