"use client";

import { useMemo, useState } from "react";
import type { PolishCard } from "@/lib/types/cards";

type CatalogClientProps = {
  polishes: PolishCard[];
};

type FilterState = {
  brand: string;
  color: string;
  colorType: string;
  polishType: string;
};

type SelectOption = {
  key: string;
  label: string;
};

const ALL = "__all__";

const normalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const brandLabelMap: Record<string, string> = {
  essie: "Essie",
  hm: "HM",
  holotaco: "Holo Taco",
  misc: "Misc"
};

const polishTypeLabelMap: Record<string, string> = {
  creme: "Creme",
  multichrome: "Multichrome",
  holographic: "Holographic",
  glitter: "Glitter",
  topper: "Topper",
  metallic: "Metallic",
  topcoat: "Topcoat",
  basecoat: "Basecoat"
};

const colorTypeLabelMap: Record<string, string> = {
  warm: "Warm",
  cold: "Cold"
};

const toOptions = (
  values: Array<string | null | undefined>,
  labelMap?: Record<string, string>
): SelectOption[] => {
  const seen = new Map<string, string>();

  for (const raw of values) {
    const value = raw?.trim();
    if (!value) continue;

    const key = normalize(value);
    if (!key) continue;

    const mappedLabel = labelMap?.[key] ?? value;
    if (!seen.has(key)) {
      seen.set(key, mappedLabel);
    }
  }

  return [...seen.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const initialFilters: FilterState = {
  brand: ALL,
  color: ALL,
  colorType: ALL,
  polishType: ALL
};

export function CatalogClient({ polishes }: CatalogClientProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const options = useMemo(
    () => ({
      brands: toOptions(polishes.map((item) => item.brand), brandLabelMap),
      colors: toOptions(polishes.map((item) => item.color)),
      colorTypes: toOptions(polishes.map((item) => item.colorType), colorTypeLabelMap),
      polishTypes: toOptions(
        polishes.map((item) => item.polishType),
        polishTypeLabelMap
      )
    }),
    [polishes]
  );

  const filteredPolishes = useMemo(
    () =>
      polishes.filter((item) => {
        if (filters.brand !== ALL && normalize(item.brand) !== filters.brand) {
          return false;
        }

        if (
          filters.color !== ALL &&
          normalize(item.color ?? "") !== filters.color
        ) {
          return false;
        }

        if (
          filters.colorType !== ALL &&
          normalize(item.colorType ?? "") !== filters.colorType
        ) {
          return false;
        }

        if (
          filters.polishType !== ALL &&
          normalize(item.polishType ?? "") !== filters.polishType
        ) {
          return false;
        }

        return true;
      }),
    [filters, polishes]
  );

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== ALL);

  return (
    <div className="catalog-layout">
      <section className="catalog-filters" aria-label="Catalog filters">
        <h2>Filters</h2>
        <div className="catalog-filter-grid">
          <label>
            Brand
            <select
              value={filters.brand}
              onChange={(event) => updateFilter("brand", event.target.value)}
            >
              <option value={ALL}>Any brand</option>
              {options.brands.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color
            <select
              value={filters.color}
              onChange={(event) => updateFilter("color", event.target.value)}
            >
              <option value={ALL}>Any color</option>
              {options.colors.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color Type
            <select
              value={filters.colorType}
              onChange={(event) => updateFilter("colorType", event.target.value)}
              disabled={options.colorTypes.length === 0}
            >
              <option value={ALL}>Any color type</option>
              {options.colorTypes.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Polish Type
            <select
              value={filters.polishType}
              onChange={(event) => updateFilter("polishType", event.target.value)}
              disabled={options.polishTypes.length === 0}
            >
              <option value={ALL}>Any polish type</option>
              {options.polishTypes.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-filter-actions">
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            disabled={!hasActiveFilters}
          >
            Reset filters
          </button>
        </div>
      </section>

      <section aria-live="polite" className="catalog-results">
        {filteredPolishes.length > 0 ? (
          <ul className="card-grid" aria-label="Polish cards">
            {filteredPolishes.map((polish) => (
              <li key={polish.id} className="card-item">
                <article className="catalog-card">
                  <div className="catalog-card__main-row">
                    <div className="catalog-card__text">
                      <p className="catalog-card__eyebrow">{polish.brand}</p>
                      <h3>{polish.title}</h3>
                      <div className="catalog-card__finish-row">
                        <p>{polish.polishType ?? polish.finish}</p>
                      </div>
                      <p className="catalog-card__meta">
                        Color: {polish.color ?? "Unknown"}
                      </p>
                    </div>
                    <span
                      className={`catalog-color-swatch ${
                        polish.colorHex ? "" : "catalog-color-swatch--empty"
                      }`}
                      style={
                        polish.colorHex
                          ? { backgroundColor: polish.colorHex }
                          : undefined
                      }
                      aria-label={
                        polish.colorHex
                          ? `Color preview ${polish.colorHex}`
                          : "No color preview available"
                      }
                      title={polish.colorHex ?? "No color value"}
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="catalog-empty" role="status">
            <p>No polishes match those filters. Reset to see the full catalog.</p>
          </div>
        )}
      </section>
    </div>
  );
}
