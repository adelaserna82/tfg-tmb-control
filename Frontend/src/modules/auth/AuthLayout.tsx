import { Outlet } from "react-router-dom";
import loginImage from "@/assets/images/plano-bg-gray.png"; 

export default function AuthLayout() {
    return (
        <div className="relative flex w-full min-h-screen items-center justify-center px-1">
            <div className="absolute inset-0">
                <img
                    src={loginImage}
                    alt="Fondo de autenticación"
                    className="w-full h-full object-cover blur-sm md:blur-md"
                />
                <div className="absolute inset-0 bg-gray-700/30"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-white">TMB Control</h1>
                <Outlet />
            </div>
        </div>
    );
}
