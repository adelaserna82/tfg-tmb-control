import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <Router> 
      <ToastContainer />
      <AppRoutes />
    </Router>
  );
}
