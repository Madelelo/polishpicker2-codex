export default function PickerLoading() {
  return (
    <section className="page" aria-busy="true" aria-live="polite">
      <h1>Picker</h1>
      <div className="loading-panel" role="status">
        <div className="loading-line loading-line--title" />
        <div className="loading-line" />
        <div className="loading-grid loading-grid--picker" aria-hidden>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="loading-card loading-card--tall" />
          ))}
        </div>
      </div>
    </section>
  );
}
