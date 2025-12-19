export interface Product {
  name: string;
  abv: number;
  ibu: number;
  description: string;
  image_url: string;
}

export interface JsonBinResponse<T> {
  record: T;
}
