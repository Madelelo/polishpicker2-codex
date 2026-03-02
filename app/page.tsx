import Link from "next/link";

export default function HomePage() {
  return (
    <section className="page">
      <h1>Nail Polish Closet Picker</h1>
      <p>
        Organize your polish collection, browse ideas, and discover a random
        mani combo.
      </p>
      <div className="actions">
        <Link href="/catalog">Browse Catalog</Link>
        <Link href="/picker">Open Picker</Link>
      </div>
    </section>
  );
}
