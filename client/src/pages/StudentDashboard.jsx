import { useEffect, useState } from "react";
import api from "../api/axios";
import PageLayout from "../ui/layout/PageLayout";
import Card from "../ui/components/Card";
import Button from "../ui/components/Button";
import MajorCircle from "../ui/charts/MajorCircle";

export default function StudentDashboard() {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/questions/week/1")
      .then((res) => setQuestion(res.data.question))
      .catch(() => setError("فشل تحميل السؤال"));
  }, []);

  const submit = async () => {
    if (selected === null) return;

    try {
      const res = await api.post(
        `/questions/answer/${question._id}`,
        { selectedIndex: selected }
      );

      setResult(res.data.correct);
      setStats(res.data.stats);
    } catch {
      setError("فشل إرسال الإجابة");
    }
  };

  return (
    <PageLayout>
      <Card>
        <h2>سؤال الأسبوع</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {question && (
          <>
            <p>{question.questionText}</p>

            {question.options.map((o, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="radio"
                  name="answer"
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                />
                {o}
              </label>
            ))}

            <Button onClick={submit}>إرسال</Button>

            {result !== null && (
              <p style={{ marginTop: 10 }}>
                {result ? "إجابة صحيحة ✅" : "إجابة خاطئة ❌"}
              </p>
            )}
          </>
        )}
      </Card>

      {/* ===== الإحصائيات ===== */}
      {stats && (
        <Card>
          <h3>إحصائيات الإجابة</h3>
          <p>عدد المشاركين: {stats.totalAnswers}</p>
          <p>عدد الإجابات الصحيحة: {stats.correctAnswers}</p>

          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            {stats.majors.map((m) => (
              <MajorCircle
                key={m.major}
                label={m.major}
                percent={m.percent}
              />
            ))}
          </div>
        </Card>
      )}
    </PageLayout>
  );
}
const styles = {
  option: {
    display: "block",
    padding: "8px 0",
  },
  stats: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    background: "#eff6ff",
    textAlign: "center",
  },
}