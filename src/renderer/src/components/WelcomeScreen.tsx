import styles from './WelcomeScreen.module.css'

interface Props {
  onOpenFolder: () => void
}

export function WelcomeScreen({ onOpenFolder }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📄</div>
        <h1 className={styles.title}>MDViewer</h1>
        <p className={styles.subtitle}>Browse markdown files from AI agentic workflows</p>
        <button className={styles.openBtn} onClick={onOpenFolder}>
          📁 Open Folder
        </button>
        <p className={styles.hint}>or use File → Open Folder</p>
      </div>
    </div>
  )
}
