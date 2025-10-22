import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import * as XLSX from "xlsx";

export default function PanelDueno() {
  const [reservas, setReservas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Campos para bloqueo
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [hora, setHora] = useState("");
  const [diaCompleto, setDiaCompleto] = useState(false);

  // Colecciones
  const reservasRef = collection(db, "reservas");
  const bloqueosRef = collection(db, "bloqueos");

  // Escuchar cambios en tiempo real (reservas y bloqueos)
  useEffect(() => {
    const q1 = query(reservasRef, orderBy("fecha", "asc"));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setReservas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const q2 = query(bloqueosRef, orderBy("fechaInicio", "asc"));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      setBloqueos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Agregar bloqueo
  const agregarBloqueo = async () => {
    if (!fechaInicio)
      return alert("Selecciona al menos una fecha de inicio para bloquear.");

    if (fechaFin && fechaFin < fechaInicio)
      return alert("La fecha final no puede ser anterior a la inicial.");

    await addDoc(bloqueosRef, {
      fechaInicio,
      fechaFin: fechaFin || fechaInicio,
      hora: diaCompleto ? "todo" : hora || "todo",
      tipo: diaCompleto
        ? fechaFin
          ? "rango de días completo"
          : "día completo"
        : "horario",
      creado: new Date(),
    });

    setFechaInicio("");
    setFechaFin("");
    setHora("");
    setDiaCompleto(false);
  };

  // Eliminar bloqueo
  const eliminarBloqueo = async (id) => {
    if (window.confirm("¿Eliminar este bloqueo?")) {
      await deleteDoc(doc(db, "bloqueos", id));
    }
  };

  // Eliminar reserva
  const eliminarReserva = async (id) => {
    if (window.confirm("¿Eliminar esta reserva?")) {
      await deleteDoc(doc(db, "reservas", id));
    }
  };

  // Editar reserva
  const editarReserva = async (id) => {
    const nuevoNombre = prompt("Nuevo nombre del cliente:");
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):");
    const nuevaHora = prompt("Nueva hora (HH:MM):");

    if (!nuevoNombre || !nuevaFecha || !nuevaHora)
      return alert("Todos los campos son obligatorios.");

    await updateDoc(doc(db, "reservas", id), {
      nombre: nuevoNombre,
      fecha: nuevaFecha,
      hora: nuevaHora,
    });
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(reservas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reservas");
    XLSX.writeFile(libro, "reservas.xlsx");
  };

  // Filtrar reservas
  const reservasFiltradas = reservas.filter((r) => {
    const coincideNombre = r.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideFecha = fechaFiltro ? r.fecha === fechaFiltro : true;
    return coincideNombre && coincideFecha;
  });

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        👑 Panel del Dueño
      </h2>

      {/* 🔒 Bloqueo de horarios / días / rangos */}
      <div className="border p-4 rounded-lg bg-gray-50 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">
          ⏳ Bloquear horario, día o rango de días
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border rounded-lg p-2 flex-1"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border rounded-lg p-2 flex-1"
          />
          {!diaCompleto && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="border rounded-lg p-2 flex-1"
            />
          )}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={diaCompleto}
              onChange={(e) => setDiaCompleto(e.target.checked)}
            />
            Día(s) completo(s)
          </label>

          <button
            onClick={agregarBloqueo}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Bloquear
          </button>
        </div>

        {/* Bloqueos activos */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📅 Bloqueos activos</h3>
          {bloqueos.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay bloqueos registrados.</p>
          ) : (
            <ul className="divide-y divide-gray-200 text-sm">
              {bloqueos.map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between items-center py-1"
                >
                  <div>
                    <strong>
                      {b.fechaInicio}
                      {b.fechaFin && b.fechaFin !== b.fechaInicio
                        ? ` → ${b.fechaFin}`
                        : ""}
                    </strong>{" "}
                    ({b.hora === "todo" ? "día(s) completo(s)" : `${b.hora} hrs`})
                  </div>
                  <button
                    onClick={() => eliminarBloqueo(b.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 📋 Tabla de Reservas */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="border rounded-lg p-2 flex-1"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <input
          type="date"
          className="border rounded-lg p-2 flex-1"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />
        <button
          onClick={exportarExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          📊 Exportar a Excel
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Hora</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 text-gray-500">
                No hay reservas registradas.
              </td>
            </tr>
          ) : (
            reservasFiltradas.map((r) => (
              <tr key={r.id} className="text-center border">
                <td className="p-2 border">{r.nombre}</td>
                <td className="p-2 border">{r.fecha}</td>
                <td className="p-2 border">{r.hora}</td>
                <td className="p-2 border">{r.email}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => editarReserva(r.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarReserva(r.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
