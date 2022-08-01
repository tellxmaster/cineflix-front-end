export interface CustomResponse {
    timestamp: Date;
    statusCode: number;
    status: String;
    reason: String;
    message: String;
    developerMessage: String;
    data: any;
}
