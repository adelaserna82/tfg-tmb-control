import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "@/components/ui/Link";

export default function RememberPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Enviar enlace a:", email);

    navigate("/reset-password");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-10 max-w-lg mx-auto w-full"
    >
      <h2 className="text-xl font-bold text-gray-100">Recuperar Contraseña</h2>
      <p className="text-gray-300 mb-3">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <Input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={setEmail}
      />

      <div className="flex justify-center">
        <Button type="submit">Enviar Enlace</Button>
      </div>

      <p className="text-center text-gray-500 text-sm mt-3">
        <Link to="/login">
          ¿Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}
