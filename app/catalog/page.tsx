import { getPolishes, getSanityConnectionStatus } from "@/lib/sanity/queries";

export default async function CatalogPage() {
  const [polishes, sanityStatus] = await Promise.all([
    getPolishes(),
    getSanityConnectionStatus()
  ]);

  return (
    <section className="page">
      <h1>Catalog</h1>
      <p
        className={`status-pill ${
          sanityStatus.state === "connected"
            ? "status-ok"
            : sanityStatus.state === "error"
              ? "status-error"
              : "status-warn"
        }`}
      >
        Sanity status: {sanityStatus.state}
      </p>
      <p>{sanityStatus.message}</p>
      <p>
        {polishes.length > 0
          ? `Showing ${polishes.length} active polish entries from Sanity.`
          : "No active polish entries found. Add data in Sanity or set env vars."}
      </p>
      {polishes.length > 0 ? (
        <ul className="card-grid" aria-label="Polish cards">
          {polishes.map((polish) => (
            <li key={polish.id} className="card-item">
              <article>
                <h2>{polish.title}</h2>
                <p>
                  {polish.brand} · {polish.finish}
                </p>
                <p>Slug: {polish.slug}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
