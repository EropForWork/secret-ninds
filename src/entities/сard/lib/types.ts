export interface ICard {
  _id: number;
  name: string;
  color: string;
  balance: number;
  lastOperation: IOperation;
  operations: IOperation[];
}

export interface IOperation {
  amount: number;
  date: string;
  description: string;
}
