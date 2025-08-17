import { Favorite, SearchHistory } from '@prisma/client';

export type { Favorite, SearchHistory };

export interface FavoriteWithDetails extends Favorite {
  approachDateFormatted: string;
  diameterFormatted: string;
}

export interface CreateFavoriteInput {
  neoId: string;
  neoName: string;
  approachDate: Date;
  isHazardous: boolean;
  estimatedDiameter: number;
}