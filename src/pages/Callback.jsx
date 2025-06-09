import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Callback() {
  const { userManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => navigate("/labs", { replace: true }))
      .catch((err) => {
        console.error(err);
        navigate("/", { replace: true });
      });
  }, [userManager, navigate]);

  return (
    <p className="flex h-screen items-center justify-center">
      Processando login…
    </p>
  );
}

export default Callback;
