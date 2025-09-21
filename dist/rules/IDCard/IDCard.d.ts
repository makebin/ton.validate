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
    /** 根据身份证号获取性别 */
    sex(): string;
    /** 根据身份证号获取生日 */
    birthday(): string;
    /** 根据身份证号获取出生地 */
    area(): string;
    /** 根据身份证号获取年龄 */
    age(): number;
    /** 解析身份证信息 */
    parse(): Result | {
        sex: string;
        birthday: string;
        age: number;
        area: string;
    };
}
export default IDCard;
