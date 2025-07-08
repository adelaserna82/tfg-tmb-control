import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Nueva contraseña:", newPassword);

    navigate("/login");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-10 max-w-lg mx-auto w-full"
    >
      <h2 className="text-xl font-bold text-gray-100">Restablecer Contraseña</h2>
      <p className="text-gray-300 mb-3">Ingresa tu nueva contraseña.</p>

      <Input
        type="password"
        placeholder="Nueva Contraseña"
        value={newPassword}
        onChange={setNewPassword}

      />

      <Input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={setConfirmPassword}

      />

      <div className="flex justify-center">
        <Button type="submit">Guardar y Volver al Inicio</Button>
      </div>
    </form>
  );
}
