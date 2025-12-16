import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageLayout from "../ui/layout/PageLayout";
import Card from "../ui/components/Card";
import Input from "../ui/components/Input";
import Button from "../ui/components/Button";

const majors = [
  "اقتصاد",
  "محاسبة",
  "إدارة",
  "تمويل ومصارف",
  "تسويق",
  "علوم سياسية",
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    studentNumber: "",
    major: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    navigate("/student");
  } catch (err) {
    alert(err.response?.data?.message || "حصل خطأ");
  }
};

  return (
    <PageLayout center>
      <Card>
        <h2>تسجيل الطالب</h2>

        <form onSubmit={submit}>
          <Input
            placeholder="اسم الطالب"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            placeholder="الرقم الدراسي"
            value={form.studentNumber}
            onChange={(e) =>
              setForm({ ...form, studentNumber: e.target.value })
            }
          />

          <select
            className="input"
            value={form.major}
            onChange={(e) =>
              setForm({ ...form, major: e.target.value })
            }
          >
            <option value="">اختر التخصص</option>
            {majors.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <Button type="submit">دخول</Button>
        </form>
      </Card>
    </PageLayout>
  );
}
