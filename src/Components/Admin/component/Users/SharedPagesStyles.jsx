/* ── Shared responsive CSS for Agents/Users pages ── */
export const SHARED_PAGE_STYLES = `
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* ── Outer page wrapper ── */
  .nf-page-wrap {
    padding: 20px 16px;
    max-width: 1000px;
    margin: 0 auto;
  }
  @media (min-width: 640px) { .nf-page-wrap { padding: 32px 40px; } }

  /* ── Stats grid ── */
  .nf-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
  @media (min-width: 480px) { .nf-stats-grid { grid-template-columns: repeat(3,1fr); } }

  /* ── Toolbar: search + filter buttons ── */
  .nf-toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (min-width: 560px) {
    .nf-toolbar { flex-direction: row; align-items: center; }
  }

  /* Filter button group — wraps on very small screens */
  .nf-filter-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  /* ── Table container — horizontal scroll on mobile ── */
  .nf-table-outer {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 1px 8px rgba(0,0,0,0.05);
  }
  .nf-table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .nf-table-head {
    display: grid;
    grid-template-columns: 2.2fr 1.5fr 1fr 160px;
    padding: 13px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    min-width: 520px;
  }
  .nf-table-row {
    display: grid;
    grid-template-columns: 2.2fr 1.5fr 1fr 160px;
    padding: 15px 24px;
    align-items: center;
    min-width: 520px;
    transition: background 0.15s;
  }
  .nf-table-row:hover { background: #fafbff; }

  /* ── Pagination ── */
  .nf-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 24px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
  }

  /* ── Modals — full-screen on mobile ── */
  .nf-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(11,26,46,0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }
  .nf-modal-card {
    background: #fff;
    width: 100%;
    max-width: 100%;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
    max-height: 95vh;
    display: flex;
    flex-direction: column;
    animation: modalIn 0.22s ease;
  }
  @media (min-width: 600px) {
    .nf-modal-backdrop {
      align-items: center;
      padding: 20px;
    }
    .nf-modal-card {
      max-width: 520px;
      border-radius: 24px;
      max-height: 90vh;
    }
  }
  .nf-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 20px;
  }
  @media (min-width: 600px) { .nf-modal-body { padding: 22px 28px; } }

  .nf-modal-footer {
    padding: 14px 20px 20px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    gap: 10px;
  }
  @media (min-width: 600px) { .nf-modal-footer { padding: 16px 28px 20px; } }

  /* Modal header */
  .nf-modal-header {
    padding: 22px 20px 18px;
    position: relative;
    min-height: 90px;
  }
  @media (min-width: 600px) { .nf-modal-header { padding: 28px 28px 22px; } }

  /* Delete modal — centered on all screens */
  .nf-delete-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(11,26,46,0.6);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .nf-delete-card {
    background: #fff;
    border-radius: 24px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 32px 64px rgba(11,26,46,0.2);
    overflow: hidden;
    animation: modalIn 0.22s ease;
  }

  /* Action buttons in table row — icon-only on mobile */
  .nf-action-btn-text { display: none; }
  @media (min-width: 440px) { .nf-action-btn-text { display: inline; } }
`;