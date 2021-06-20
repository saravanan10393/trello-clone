import styles from "./board.module.css";

export function TaskCard({ task }) {
  return (
    <div className={styles.taskCard}>
      <h5>{task.Title}</h5>
      <div className={styles.cardDetails}>
        <div className={styles.dueDate} />
        <div className={styles.assignedTo} />
      </div>
    </div>
  );
}
