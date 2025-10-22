import { useState } from "react";

export default function ReservationForm({ addReservation }) {
  const [form, setForm] = useState({ name: "", date: "", time: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.time)
      return alert("Completa todos los campos");
    addReservation(form);
    setForm({ name: "", date: "", time: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-center"
    >
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre del cliente"
        className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3"
      />
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3"
      />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
      >
        Agregar
      </button>
    </form>
  );
}
