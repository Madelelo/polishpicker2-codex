import { getNailArt, getPolishes } from "@/lib/sanity/queries";
import { PickerClient } from "@/app/picker/picker-client";

export default async function PickerPage() {
  const [polishes, nailArt] = await Promise.all([getPolishes(), getNailArt()]);

  return (
    <section className="page picker-page">
      <h1>Picker</h1>
      <p>
        Swipe on touch/trackpad, drag with mouse, or use arrow keys while a stack
        is focused.
      </p>
      <PickerClient polishes={polishes} nailArt={nailArt} />
    </section>
  );
}
