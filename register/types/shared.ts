import { type Index, MeiliSearch } from "meilisearch";
import { prisma } from "#app/utils/db.server.ts";

export type IDropAria = {
  name: string;
  emergency: boolean;
  trigger: boolean;
  quest_ranks?: number[];
};

export const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST,
  apiKey: process.env.MEILISEARCH_APIKEY,
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
  return await prisma.item.findFirst({
    where: {
      name: itemName,
    },
  });
}

export async function registerDropAria(arias: string[]) {
  let droparias = [];
  for (const aria of arias) {
    const hitAria = await prisma.itemDroparia.findFirst({
      where: {
        name: aria,
      },
    });
    if (hitAria === null) {
      const createdAria = await prisma.itemDroparia.create({
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

export type TAbility = {
  name: string
  rarity: number
  image_type: string
  main_class_only: boolean
  arias: {name: string, emergency: boolean, trigger: boolean}[]
  effects: {name: string, percent: boolean, types: string[], value: number}[]
 
 }