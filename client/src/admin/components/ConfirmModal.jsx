import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  if (!title) return null;
  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget && !busy) onCancel();
    }}>
      <div className="admin-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="admin-modal__close" type="button" onClick={onCancel} disabled={busy} aria-label="Close"><X /></button>
        <AlertTriangle className="admin-modal__warning" />
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="admin-modal__actions">
          <button className="admin-button admin-button--ghost" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
