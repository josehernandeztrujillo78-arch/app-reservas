import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LoginFirebase from "./components/LoginFirebase";
import Reservas from "./components/Reservas";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      setUser(userFirebase);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const ADMIN_EMAIL = "enriquej412@gmail.com";

  if (!user) {
    return <LoginFirebase onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white flex justify-between items-center p-4 shadow-md">
        <h1 className="text-xl font-bold">📅 Sistema de Reservas</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-4 py-1 rounded-lg hover:bg-gray-200 transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="p-6">
        {/* Cualquier usuario puede reservar */}
        <Reservas />

        {/* Solo el dueño ve el panel completo */}
        {user.email === ADMIN_EMAIL && <AdminPanel />}
      </main>
    </div>
  );
}
