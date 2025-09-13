export interface ICard {
  _id: number;
  name: string;
  color: string;
  balance: number;
  lastOperation: {
    amount: number;
    date: string;
    description?: string;
  };
}
