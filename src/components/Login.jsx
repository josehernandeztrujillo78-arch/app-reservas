import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("loggedIn", "true");
      onLogin(true);
    } else {
      setError("Credenciales incorrectas");
    }
  };

  // 🔹 Enviar correo de recuperación con Firebase
  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    if (!emailRecuperacion) return setMensaje("Ingresa un correo válido.");

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, emailRecuperacion);
      setMensaje("📩 Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      console.error(error);
      setMensaje("⚠️ Error al enviar el correo. Verifica que esté registrado.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm relative">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Entrar
          </button>

          {/* 🔹 Botón para mostrar el modal */}
          <button
            type="button"
            onClick={() => setMostrarModal(true)}
            className="text-blue-600 hover:underline mt-2 text-sm w-full text-center"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>

      {/* 🔹 Modal para recuperación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3 text-center text-blue-700">
              Recuperar contraseña
            </h3>

            <form onSubmit={handleRecuperarPassword} className="space-y-3">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={emailRecuperacion}
                onChange={(e) => setEmailRecuperacion(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Enviar correo
              </button>
            </form>

            <button
              onClick={() => {
                setMostrarModal(false);
                setMensaje("");
                setEmailRecuperacion("");
              }}
              className="text-gray-600 hover:text-red-500 mt-3 text-sm w-full text-center"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
