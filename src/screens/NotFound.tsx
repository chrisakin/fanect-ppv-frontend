import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h1 className="text-4xl font-bold text-green-600">404</h1>
      <p className="text-lg text-gray-700">Page Not Found</p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );
};