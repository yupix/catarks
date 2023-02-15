import { prisma } from "../db/session";
import { config } from "@catarks/shared";
import MeiliSearch from "meilisearch";

export const meilisearch = new MeiliSearch({
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apikey,
});

export async function Indexer(
  indexName: string,
  documents: any[],
  options: {
    sortableattributes: string[];
    FilterableAttributes: string[];
  }
) {
  const shared = async () => {
    await meilisearch.createIndex(indexName);
    let index = await meilisearch.getIndex(indexName);
    await index.addDocuments(documents);
    await index.updateSortableAttributes(options.sortableattributes);
    await index.updateFilterableAttributes(options.FilterableAttributes);
  };
  try {
    let oldIndex = await meilisearch.getIndex(indexName);
    await oldIndex.delete();
    await shared();
  } catch (err: any) {
    if (err.code === "index_not_found") {
      await shared();
    }
  }
}

export async function findItemByName(itemName: string) {
  return await prisma.items.findFirst({
    where: {
      name: itemName,
    },
  });
}

export async function registerDropAria(aries: string[]) {
  let droparias = [];
  for (const aria of aries) {
    const hitAria = await prisma.dropArias.findFirst({
      where: {
        name: aria,
      },
    });
    if (hitAria === null) {
      const createdAria = await prisma.dropArias.create({
        data: {
          name: aria,
        },
      });
      droparias.push({ name: createdAria.name });
    } else {
      droparias.push({ name: hitAria.name });
    }
  }
  return droparias;
}
