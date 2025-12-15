import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../../ui/components/Button";

export default function AdminPanel() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [stats, setStats] = useState([]);

  const token = localStorage.getItem("token");

  // تحميل سؤال الأسبوع
  useEffect(() => {
    api
      .get("/questions/week/1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCurrent(res.data.question))
      .catch(() => {});
  }, []);

  const submitQuestion = async () => {
    await api.post(
      "/questions",
      {
        weekNumber: 1,
        questionText,
        options,
        correctIndex,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("تم حفظ السؤال");
  };

  return (
    <div style={pageStyle}>
      <h2>لوحة المشرف</h2>

      {/* إضافة سؤال */}
      <section>
        <h3>إضافة سؤال الأسبوع</h3>

        <textarea
          placeholder="نص السؤال"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={textareaStyle}
        />

        {options.map((o, i) => (
          <input
            key={i}
            placeholder={`خيار ${i + 1}`}
            value={o}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
            style={inputStyle}
          />
        ))}

        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>الخيار 1 صحيح</option>
          <option value={1}>الخيار 2 صحيح</option>
          <option value={2}>الخيار 3 صحيح</option>
          <option value={3}>الخيار 4 صحيح</option>
        </select>

        <Button onClick={submitQuestion}>حفظ السؤال</Button>
      </section>

      <hr />

      {/* سؤال الأسبوع */}
      {current && (
        <section>
          <h3>سؤال الأسبوع الحالي</h3>
          <p>{current.questionText}</p>
          <ul>
            {current.options.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </section>
      )}

      <hr />

      {/* الإحصائيات */}
      <section>
        <h3>إحصائيات الإجابات</h3>
        <p>سيتم عرضها هنا (دوائر لاحقًا)</p>
      </section>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: 40,
  direction: "rtl",
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const textareaStyle = {
  width: "100%",
  minHeight: 80,
  padding: 10,
  marginBottom: 10,
};
