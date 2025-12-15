export default function MajorCircle({ percent, label }) {
  return (
    <div style={{ textAlign: "center", width: 120 }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "8px solid #2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {percent}%
      </div>
      <p style={{ marginTop: 8 }}>{label}</p>
    </div>
  );
}
