import { useState } from "react";

export default function ReservationList({ reservations, deleteReservation }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = reservations.filter((r) => {
    const matchName = r.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? r.date === dateFilter : true;
    return matchName && matchDate;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-3">Reservas</h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/2"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/2"
        />
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No hay reservas que coincidan.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filtered.map((r, i) => (
            <li
              key={i}
              className="flex justify-between items-center py-2 px-1 hover:bg-gray-50 rounded-md"
            >
              <span>
                <strong>{r.name}</strong> — {r.date} a las {r.time}
              </span>
              <button
                onClick={() => deleteReservation(i)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
