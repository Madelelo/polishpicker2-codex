import Link from "next/link";

export default function HomePage() {
  return (
    <section className="page home-page">
      <div className="home-page__inner">
        <h1>Welcome to Maddie&apos;s Nail Polish Closet</h1>
        <p>
          Browse your polish collection, explore nail-art ideas, and quickly build a
          combo you love.
        </p>
        <div className="actions">
          <Link href="/catalog">Browse Catalog</Link>
          <Link href="/picker">Open Picker</Link>
        </div>
      </div>
    </section>
  );
}
