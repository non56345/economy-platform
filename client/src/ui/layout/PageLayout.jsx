export default function PageLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 420,
  },
};
