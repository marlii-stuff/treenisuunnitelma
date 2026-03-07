import React from "react";
export default function HistoryPanel({ items }) {
  return (
    <aside className="history-panel">
      <h2>Treenihistoria</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>
              <strong>{item.action}</strong> - {new Date(item.changedAt).toLocaleString("fi-FI")}
            </p>
            <small>{item.payload?.name || item.payload?.after?.name || "(poistettu treeni)"}</small>
          </li>
        ))}
      </ul>
    </aside>
  );
}
