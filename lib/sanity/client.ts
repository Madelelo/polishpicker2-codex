import { createClient } from "@sanity/client";
import { isSanityConfigured, sanityEnv } from "@/lib/sanity/env";

const fallbackClient = createClient({
  projectId: "missing-project-id",
  dataset: "missing-dataset",
  apiVersion: sanityEnv.apiVersion,
  useCdn: false,
  perspective: "published"
});

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      token: sanityEnv.token,
      useCdn: !sanityEnv.token,
      perspective: "published"
    })
  : fallbackClient;
