import AnimatedRoutes from "./AnimatedRoutes";

export default function App() {
  return <AnimatedRoutes />;
}
useEffect(() => {
  api.get("/").catch(() => {});
}, []);

