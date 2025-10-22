export default function ExportImport({ reservations, setReservations }) {
  const exportJSON = () => {
    const data = JSON.stringify(reservations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reservas.json";
    link.click();
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imported = JSON.parse(event.target.result);
      setReservations(imported);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex justify-end items-center gap-4 mt-4">
      <button
        onClick={exportJSON}
        className="text-sm text-primary hover:underline"
      >
        Exportar JSON
      </button>
      <label className="text-sm text-primary cursor-pointer hover:underline">
        Importar JSON
        <input type="file" accept=".json" onChange={importJSON} className="hidden" />
      </label>
    </div>
  );
}
