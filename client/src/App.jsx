import { useEffect } from "react";
import AnimatedRoutes from "./AnimatedRoutes";
import api from "./api/axios";

export default function App() {
  useEffect(() => {
    api.get("/").catch(() => {});
  }, []);

  return <AnimatedRoutes />;
}
