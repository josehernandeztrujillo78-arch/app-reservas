import { useState } from "react";

export default function ReservationTable({ reservas, onDelete, onEdit }) {
  const [editandoId, setEditandoId] = useState(null);
  const [valoresEdit, setValoresEdit] = useState({});

  const iniciarEdicion = (reserva) => {
    setEditandoId(reserva.id);
    setValoresEdit({
      nombre: reserva.nombre,
      fecha: reserva.fecha,
      hora: reserva.hora,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setValoresEdit({});
  };

  const guardarEdicion = () => {
    onEdit(editandoId, valoresEdit);
    cancelarEdicion();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">📋 Todas las Reservas</h3>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-2 px-3 text-left">Cliente</th>
            <th className="py-2 px-3 text-left">Fecha</th>
            <th className="py-2 px-3 text-left">Hora</th>
            <th className="py-2 px-3 text-left">Email</th>
            <th className="py-2 px-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No hay reservas registradas.
              </td>
            </tr>
          ) : (
            reservas.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                {/* NOMBRE */}
                <td className="py-2 px-3">
                  {editandoId === r.id ? (
                    <input
                      type="text"
                      value={valoresEdit.nombre}
                      onChange={(e) =>
                        setValoresEdit({ ...valoresEdit, nombre: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    r.nombre
                  )}
                </td>

                {/* FECHA */}
                <td className="py-2 px-3">
                  {editandoId === r.id ? (
                    <input
                      type="date"
                      value={valoresEdit.fecha}
                      onChange={(e) =>
                        setValoresEdit({ ...valoresEdit, fecha: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    r.fecha
                  )}
                </td>

                {/* HORA */}
                <td className="py-2 px-3">
                  {editandoId === r.id ? (
                    <input
                      type="time"
                      value={valoresEdit.hora}
                      onChange={(e) =>
                        setValoresEdit({ ...valoresEdit, hora: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    r.hora
                  )}
                </td>

                {/* EMAIL */}
                <td className="py-2 px-3">{r.email}</td>

                {/* ACCIONES */}
                <td className="py-2 px-3 text-center">
                  {editandoId === r.id ? (
                    <>
                      <button
                        onClick={guardarEdicion}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                      >
                        💾 Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        ✖ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicion(r)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onDelete(r.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
