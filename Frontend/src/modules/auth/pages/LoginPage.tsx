import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/api/generated/auth";
import { loginRequestAdapter } from "../types/adapters";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (res) => {
        const data = res.data as { token: string };
        const token = data.token;
        login(
          token
        );
        navigate("/indicadores");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate({ data: loginRequestAdapter(username, password) });

  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="space-y-4 mt-10 max-w-lg mx-auto w-full"
    >
      <Input
        placeholder="Usuario"
        value={username}
        onChange={setUsername}
      />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={setPassword}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Button type="submit">Iniciar Sesión</Button>
      </div>
    </form>
  );
}
