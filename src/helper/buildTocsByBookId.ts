import type { TocItem } from "../context";
import { extractTocFromEpubUrl } from "./getBookMeta";

type BookMeta = { _id: string; bookLink: string };

export async function buildTocsByBookId(items: BookMeta[]) {
  const results = await Promise.all(
    items.splice(0,2).map(async (b) => {
      try {
        const toc = await extractTocFromEpubUrl(b.bookLink);
        return { id: b._id, toc };
      } catch (e) {
        console.error("TOC failed for", b._id, e);
        return { id: b._id, toc: [] as TocItem[] };
      }
    })
  );

  const out = Object.fromEntries(results.map((r) => [r.id, r.toc])) as Record<string, TocItem[]>;
  return out;
}
