import React, { useEffect, useState } from "react";

const emptyForm = {
  date: "",
  name: "",
  durationMinutes: 45,
  paceTarget: "",
  notes: ""
};

export default function WorkoutModal({ isOpen, initialValue, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialValue) {
      setForm({
        date: initialValue.date,
        name: initialValue.name,
        durationMinutes: initialValue.durationMinutes,
        paceTarget: initialValue.paceTarget,
        notes: initialValue.notes || ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialValue]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "durationMinutes" ? Number(value) : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>{initialValue?.id ? "Muokkaa treenia" : "Lisaa treeni"}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="date">Paiva</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />

          <label htmlFor="name">Treenin nimi</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="durationMinutes">Kesto (min)</label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="1"
            max="1440"
            value={form.durationMinutes}
            onChange={handleChange}
            required
          />

          <label htmlFor="paceTarget">Vauhtitavoite</label>
          <input id="paceTarget" name="paceTarget" value={form.paceTarget} onChange={handleChange} required />

          <label htmlFor="notes">Muistiinpanot</label>
          <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Peruuta</button>
            <button type="submit">Tallenna</button>
          </div>
        </form>
      </div>
    </div>
  );
}
