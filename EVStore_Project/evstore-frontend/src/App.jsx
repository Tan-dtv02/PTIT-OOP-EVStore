import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </AuthProvider>
  );
}
