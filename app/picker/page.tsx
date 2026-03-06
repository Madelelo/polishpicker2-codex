import { getNailArt } from "@/lib/sanity/queries";

export default async function PickerPage() {
  const nailArt = await getNailArt();

  return (
    <section className="page">
      <h1>Picker</h1>
      <p>
        {nailArt.length > 0
          ? `Loaded ${nailArt.length} active nail-art ideas from Sanity.`
          : "No active nail-art entries found. Add data in Sanity or set env vars."}
      </p>
      {nailArt.length > 0 ? (
        <ul className="card-grid" aria-label="Nail art cards">
          {nailArt.map((idea) => (
            <li key={idea.id} className="card-item">
              <article>
                <h2>{idea.title}</h2>
                <p>Difficulty: {idea.difficulty}</p>
                <p>Tags: {idea.tags.length > 0 ? idea.tags.join(", ") : "None"}</p>
                <p>Slug: {idea.slug}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
