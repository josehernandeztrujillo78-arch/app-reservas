import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginFirebase({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, pass);
        setMensaje("✅ Cuenta creada correctamente. Ya puedes iniciar sesión.");
        setIsRegister(false);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
        onLogin(true);
      }
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, ingresa tu correo primero.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("📩 Se ha enviado un correo para restablecer tu contraseña.");
    } catch (err) {
      setError("Error al enviar el correo de recuperación.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          {isRegister ? "Crear cuenta nueva" : "Iniciar sesión"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

          <button
            type="submit"
            className="bg-blue-700 text-white w-full py-2 rounded-lg hover:bg-blue-800 transition"
          >
            {isRegister ? "Registrarme" : "Entrar"}
          </button>
        </form>

        {/* 🔹 Recuperar contraseña */}
        {!isRegister && (
          <button
            onClick={handleResetPassword}
            className="text-blue-600 hover:underline mt-3 text-sm w-full text-center"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <p className="text-sm text-gray-600 mt-4 text-center">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMensaje("");
            }}
            className="text-blue-700 hover:underline"
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}
