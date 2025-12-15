import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/admin/login", {
        email,
        password,
      });

      // ✅ تخزين التوكن
      localStorage.setItem("token", res.data.token);

      // ✅ الانتقال لصفحة الأدمن
      navigate("/admin");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>تسجيل دخول المشرف</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit}>
        <input
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">دخول</button>
      </form>
    </div>
  );
}
