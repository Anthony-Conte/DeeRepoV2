export interface Item {
  id: string;
  name: string;
  createdByUserId: string;
  createdAt: Date;
  selected: boolean;
}

export interface CreateItemDto {
  name: string;
  selected: boolean;
}
