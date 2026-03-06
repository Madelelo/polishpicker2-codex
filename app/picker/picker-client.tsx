"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { NailArtCard, PolishCard } from "@/lib/types/cards";

type PickerClientProps = {
  polishes: PolishCard[];
  nailArt: NailArtCard[];
};

type SwipeStackProps<T> = {
  title: string;
  items: T[];
  getId: (item: T) => string;
  emptyMessage: string;
  onActiveChange?: (item: T | null) => void;
  renderCard: (item: T) => ReactNode;
};

const swipeThresholdDesktop = 90;
const velocityThresholdDesktop = 500;
const swipeThresholdMobile = 64;
const velocityThresholdMobile = 360;

const normalizeType = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const typeAliasMap: Record<string, string[]> = {
  creme: ["creme", "cream"],
  holographic: ["holographic", "holo"],
  glitter: ["glitter"],
  shimmer: ["shimmer"],
  jelly: ["jelly"],
  topper: ["topper"],
  magnetic: ["magnetic", "catseye"]
};

const matchesRequiredType = (finish: string, required: string): boolean => {
  const finishNorm = normalizeType(finish);
  const requiredNorm = normalizeType(required);
  const requiredAliases = typeAliasMap[requiredNorm] ?? [requiredNorm];

  return requiredAliases.some(
    (alias) =>
      finishNorm === alias ||
      finishNorm.includes(alias) ||
      alias.includes(finishNorm)
  );
};

function SwipeStack<T>({
  title,
  items,
  getId,
  emptyMessage,
  onActiveChange,
  renderCard
}: SwipeStackProps<T>) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const count = items.length;
  const safeIndex = count > 0 ? ((index % count) + count) % count : 0;
  const activeItem = items[safeIndex] ?? null;

  const peekItems = useMemo(() => {
    if (count <= 1) {
      return [];
    }

    const nextItems: T[] = [];
    const peekCount = Math.min(2, count - 1);
    for (let offset = 1; offset <= peekCount; offset += 1) {
      nextItems.push(items[(safeIndex + offset) % count]);
    }
    return nextItems;
  }, [count, items, safeIndex]);

  useEffect(() => {
    onActiveChange?.(activeItem);
  }, [activeItem, onActiveChange]);

  const move = (nextDirection: -1 | 1) => {
    if (count === 0) {
      return;
    }

    setDirection(nextDirection);
    setIndex((current) => current + nextDirection);
  };

  const canMove = count > 1;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const isMobileViewport =
      typeof window !== "undefined" && window.matchMedia("(max-width: 680px)").matches;
    const swipeThreshold = isMobileViewport
      ? swipeThresholdMobile
      : swipeThresholdDesktop;
    const velocityThreshold = isMobileViewport
      ? velocityThresholdMobile
      : velocityThresholdDesktop;

    if (info.offset.x <= -swipeThreshold || info.velocity.x <= -velocityThreshold) {
      move(1);
      return;
    }

    if (info.offset.x >= swipeThreshold || info.velocity.x >= velocityThreshold) {
      move(-1);
    }
  };

  return (
    <section className="swipe-stack">
      <header className="swipe-stack__header">
        <h2>{title}</h2>
      </header>

      {count === 0 || activeItem === null ? (
        <div className="swipe-stack__empty" role="status">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div
          className="swipe-stack__deck"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`${title} swipe cards`}
        >
          {peekItems.map((item, idx) => (
            <div
              className="swipe-stack__peek"
              key={getId(item)}
              style={{
                transform: `translateY(${(idx + 1) * 8}px) scale(${1 - (idx + 1) * 0.03})`
              }}
              aria-hidden
            />
          ))}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={getId(activeItem)}
              className="swipe-stack__card"
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, rotate: direction * 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: direction * -70, rotate: direction * -5 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.85}
              onDragEnd={handleDragEnd}
            >
              {renderCard(activeItem)}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="swipe-stack__controls">
        <button type="button" onClick={() => move(-1)} disabled={!canMove}>
          Prev
        </button>
        <button type="button" onClick={() => move(1)} disabled={!canMove}>
          Next
        </button>
      </div>
    </section>
  );
}

export function PickerClient({ polishes, nailArt }: PickerClientProps) {
  const [activeNailArt, setActiveNailArt] = useState<NailArtCard | null>(
    nailArt[0] ?? null
  );

  const requiredPolishTypes = useMemo(() => {
    if (!activeNailArt) {
      return [];
    }
    return activeNailArt.polishRequired.slice(0, 3);
  }, [activeNailArt]);

  return (
    <div className="picker-grid">
      <SwipeStack
        title="Nail Art"
        items={nailArt}
        getId={(item) => item.id}
        emptyMessage="No active nail-art ideas are available right now."
        onActiveChange={setActiveNailArt}
        renderCard={(item) => (
          <article className="picker-card">
            <p className="picker-card__eyebrow">Difficulty: {item.difficulty}</p>
            <h3>{item.title}</h3>
            {item.nailArtType ? (
              <p className="picker-card__meta">Type: {item.nailArtType}</p>
            ) : null}
            <p>{item.description || "No description provided."}</p>
            <p className="picker-card__meta">
              Tools needed:{" "}
              {item.toolsNeeded.length > 0 ? item.toolsNeeded.join(", ") : "None"}
            </p>
          </article>
        )}
      />

      <section className="picker-polish-panel">
        <h2>Polish Picks</h2>
        {requiredPolishTypes.length > 0 ? (
          <div className="picker-polish-grid">
            {requiredPolishTypes.map((requiredType, idx) => (
              <SwipeStack
                key={`${activeNailArt?.id ?? "none"}-${requiredType}-${idx}`}
                title={`Polish ${idx + 1}: ${requiredType}`}
                items={polishes.filter((item) =>
                  matchesRequiredType(item.finish, requiredType)
                )}
                getId={(item) => item.id}
                emptyMessage={`No active ${requiredType} polish found.`}
                renderCard={(item) => (
                  <article className="picker-card picker-card--compact">
                    <p className="picker-card__eyebrow">{item.brand}</p>
                    <h3>{item.title}</h3>
                    <p>{item.finish}</p>
                    {item.colorHex ? (
                      <div className="picker-color">
                        <span
                          className="picker-color__swatch"
                          style={{ backgroundColor: item.colorHex }}
                          aria-hidden
                        />
                        <span>{item.colorHex}</span>
                      </div>
                    ) : null}
                  </article>
                )}
              />
            ))}
          </div>
        ) : (
          <div className="swipe-stack__empty" role="status">
            <p>
              {activeNailArt
                ? "This nail-art entry has no polish requirements set."
                : "Select a nail-art card to load polish requirements."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
