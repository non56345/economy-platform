export default function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 26,
    width: "100%",
    boxShadow: "0 20px 40px rgba(30,58,138,0.15)",
  },
};
