export interface Species {
  name: string;
  classification: string;
  designation: string;
  averageHeight: number;
  averageLifespan: number;
  language: string;
  homeworldId: number | null;
  filmsIds: number[];
  createdAt: string;
  editedAt: string;
}
