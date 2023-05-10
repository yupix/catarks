import { prisma } from "../db/session";
import { config } from "@catarks/shared";
import MeiliSearch, { Index } from "meilisearch";

export type IDropAria = {
  name: string;
  emergency: boolean;
  trigger: boolean;
  quest_ranks?: number[];
};

export const meilisearch = new MeiliSearch({
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apikey,
});

type TSearchServiceOptions = {
  sortableattributes: string[];
  FilterableAttributes: string[];
  SearchableAttributes: string[] | null;
}

export class SearchService {
  private meilisearchIndex: Index | null = null;
  private options: TSearchServiceOptions
  constructor(
    indexName: string,
    options: TSearchServiceOptions
  ) {
    this.meilisearchIndex = meilisearch.index(indexName);
    this.options = options
  }

  async updateSettings() {
    await this.meilisearchIndex!.updateSettings({
      searchableAttributes: this.options.SearchableAttributes,
      sortableAttributes: this.options.sortableattributes,
      filterableAttributes: this.options.FilterableAttributes,
      typoTolerance: {
        enabled: false
      },
    });
  }

  async addDocument(documents: any[]) {
    await this.updateSettings()
    if (this.meilisearchIndex) {
      await this.meilisearchIndex.deleteAllDocuments();
      await this.meilisearchIndex.addDocuments(documents);
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

export async function registerDropAria(arias: string[]) {
  let droparias = [];
  for (const aria of arias) {
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
