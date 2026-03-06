import { getPolishes } from "@/lib/sanity/queries";
import { CatalogClient } from "@/app/catalog/catalog-client";

export default async function CatalogPage() {
  const polishes = await getPolishes();

  return (
    <section className="page">
      <h1>Catalog</h1>
      {polishes.length > 0 ? (
        <CatalogClient polishes={polishes} />
      ) : (
        <p>No polish entries are available right now.</p>
      )}
    </section>
  );
}
