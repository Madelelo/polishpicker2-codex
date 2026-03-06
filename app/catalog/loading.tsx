export default function CatalogLoading() {
  return (
    <section className="page" aria-busy="true" aria-live="polite">
      <h1>Catalog</h1>
      <div className="loading-panel" role="status">
        <div className="loading-line loading-line--title" />
        <div className="loading-line" />
        <div className="loading-grid" aria-hidden>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="loading-card" />
          ))}
        </div>
      </div>
    </section>
  );
}
