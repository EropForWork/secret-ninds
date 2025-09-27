export interface ICard {
	_id: number;
	name: string;
	color: string;
	balance: number;
	lastOperation: IOperation;
	operations: IOperation[];
	order: number;
}

export interface IOperation {
	amount: number;
	date: string;
	description: string;
}

export interface ILoginResponse {
	token: string;
	message: string;
}

export interface ILoginForm {
	username: string;
	password: string;
}
