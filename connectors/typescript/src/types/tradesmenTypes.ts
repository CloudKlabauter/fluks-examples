export interface ICreateOrderParams {
    OrderText: string;
    ClientAdress: string;
}

export interface ICreateOrderResponse {
    Id: string
}

export interface IOrderCompletedFilters {
    ClientId: string;
}

export interface IOrderCompletedResponse {
    ClientID: string
    Message: string
}