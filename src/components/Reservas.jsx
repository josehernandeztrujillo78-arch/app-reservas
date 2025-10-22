import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Reservas() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [user, setUser] = useState(null);
  const [bloqueos, setBloqueos] = useState([]);
  const [reservas, setReservas] = useState([]);

  const reservasRef = collection(db, "reservas");
  const bloqueosRef = collection(db, "bloqueos");

  // 🔹 Detectar usuario actual
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      setUser(userFirebase);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Escuchar bloqueos en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(bloqueosRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBloqueos(data);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Escuchar reservas para evitar duplicados
  useEffect(() => {
    const unsubscribe = onSnapshot(reservasRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReservas(data);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Validar si el día u hora están bloqueados
  const estaBloqueado = (fechaSeleccionada, horaSeleccionada) => {
    return bloqueos.some((b) => {
      if (b.fecha === fechaSeleccionada) {
        // Día completo
        if (b.hora === "todo") return true;
        // Horario específico
        if (b.hora === horaSeleccionada) return true;
      }
      return false;
    });
  };

  // ✅ Validar si el usuario ya tiene reserva en la misma fecha y hora
  const usuarioYaReservo = (email, fechaSeleccionada, horaSeleccionada) => {
    return reservas.some(
      (r) =>
        r.email === email &&
        r.fecha === fechaSeleccionada &&
        r.hora === horaSeleccionada
    );
  };

  // 🧾 Guardar nueva reserva
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión.");
    if (!nombre || !fecha || !hora)
      return alert("Por favor completa todos los campos.");

    // 🔒 Verificar bloqueos
    if (estaBloqueado(fecha, hora)) {
      alert("🚫 No puedes reservar en una fecha u hora bloqueada.");
      return;
    }

    // 🔒 Verificar duplicados del mismo usuario
    if (usuarioYaReservo(user.email, fecha, hora)) {
      alert("⚠️ Ya tienes una reserva en esa fecha y hora.");
      return;
    }

    await addDoc(reservasRef, {
      nombre,
      fecha,
      hora,
      email: user.email,
      creado: new Date(),
    });

    setNombre("");
    setFecha("");
    setHora("");
    alert("✅ Reserva creada exitosamente.");
  };

  // 🧠 Mostrar horarios disponibles filtrando bloqueos
  const horarios = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const horariosDisponibles = horarios.filter(
    (h) => !estaBloqueado(fecha, h)
  );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        📅 Reservar cita
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded-lg p-2"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded-lg p-2"
        />

        <select
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border rounded-lg p-2"
          disabled={!fecha}
        >
          <option value="">Selecciona una hora</option>
          {horariosDisponibles.length > 0 ? (
            horariosDisponibles.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))
          ) : (
            <option disabled>🚫 No hay horarios disponibles</option>
          )}
        </select>

        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Reservar
        </button>
      </form>
    </div>
  );
}
