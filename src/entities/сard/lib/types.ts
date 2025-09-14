export interface ICard {
  _id: number;
  name: string;
  color: string;
  balance: number;
  lastOperation: IOperation;
  operations: IOperation[];
}

interface IOperation {
  amount: number;
  date: string;
  description: string;
}
