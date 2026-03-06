import { getNailArt, getPolishes } from "@/lib/sanity/queries";
import { PickerClient } from "@/app/picker/picker-client";
import Link from "next/link";

export default async function PickerPage() {
  const [polishes, nailArt] = await Promise.all([getPolishes(), getNailArt()]);
  const isEmpty = polishes.length === 0 && nailArt.length === 0;

  return (
    <section className="page picker-page">
      <h1>Polish picker</h1>
      {isEmpty ? (
        <div className="catalog-empty" role="status">
          <p>No nail-art or polish entries are available right now.</p>
          <Link href="/catalog">Open catalog</Link>
        </div>
      ) : (
        <PickerClient polishes={polishes} nailArt={nailArt} />
      )}
    </section>
  );
}
