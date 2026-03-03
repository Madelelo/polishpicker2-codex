const getVar = (key: string): string | undefined => {
  const value = process.env[key];
  if (!value) {
    return undefined;
  }
  return value;
};

export const sanityEnv = {
  projectId: getVar("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: getVar("NEXT_PUBLIC_SANITY_DATASET"),
  apiVersion: getVar("SANITY_API_VERSION") ?? "2025-01-01",
  token: getVar("SANITY_API_READ_TOKEN")
};

export const isSanityConfigured =
  Boolean(sanityEnv.projectId) && Boolean(sanityEnv.dataset);
