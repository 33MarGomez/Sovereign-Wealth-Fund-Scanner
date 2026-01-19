export interface SectorAllocation {
  sector: string;
  percentage: number;
}

export interface Fund {
  name: string;
  assets_in_billions: number;
  inception_year: string;
  description: string;
  sector_allocations: SectorAllocation[];
}

export interface SWFData {
  country: string;
  summary: string;
  currency: string;
  funds: Fund[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
}

export interface APIResponse {
  data: SWFData | null;
  groundingMetadata: GroundingMetadata | null;
}