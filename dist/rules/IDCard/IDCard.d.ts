type ErrorCode = {
    message: string;
    code: string;
};
type Result = ErrorCode & {
    status: boolean;
};
declare class IDCard {
    private idcode;
    constructor(idcode: string);
    static Test(idcode: string): Result;
    check(): Result;
    /** ��������֤�Ż�ȡ�Ա� */
    sex(): string;
    /** ��������֤�Ż�ȡ���� */
    birthday(): string;
    /** ��������֤�Ż�ȡ������ */
    area(): string;
    /** ��������֤�Ż�ȡ���� */
    age(): number;
    /** ��������֤��Ϣ */
    parse(): Result | {
        sex: string;
        birthday: string;
        age: number;
        area: string;
    };
}
export default IDCard;
