export enum Currency {
  NONE = 'Select Currency',
  USD = 'USD',
  NGN = 'NGN',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  GHS = 'GHS'
}

export interface IPrice {
  currency: Currency;
  amount: number;
}

export interface IEvent {
  name: string;
  date: Date;
  time: string;
  description: string;
  bannerUrl: string;
  watermarkUrl: string;
  createdBy: string;
  published: boolean;
  prices: IPrice[];
  haveBroadcastRoom: boolean;
  broadcastSoftware: string;
  scheduledTestDate: Date;
  eventTrailer: string;
}