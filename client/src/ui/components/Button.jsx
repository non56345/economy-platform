export default function Button({ children, type = "button", onClick }) {
  return (
    <button type={type} onClick={onClick} style={styles.button}>
      {children}
    </button>
  );
}

const styles = {
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
  },
};
