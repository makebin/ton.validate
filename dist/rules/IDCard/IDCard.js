/*
 * @Author: ��mk9007@163.com
 * @Date: 2021-02-03 14:30:22
 * @LastEditTime: 2021-02-04 09:38:50
 * @FilePath: \vue-manage\src\meview-ui\libs\util\verify\IDCode.ts
 * @Description: ����֤������֤����
 */
const areaID = {
    11: "����",
    12: "���",
    13: "�ӱ�",
    14: "ɽ��",
    15: "���ɹ�",
    21: "����",
    22: "����",
    23: "������",
    31: "�Ϻ�",
    32: "����",
    33: "�㽭",
    34: "����",
    35: "����",
    36: "����",
    37: "ɽ��",
    41: "����",
    42: "����",
    43: "����",
    44: "�㶫",
    45: "����",
    46: "����",
    50: "����",
    51: "�Ĵ�",
    52: "����",
    53: "����",
    54: "����",
    61: "����",
    62: "����",
    63: "�ຣ",
    64: "����",
    65: "�½�",
    71: "̨��",
    81: "���",
    82: "����",
    91: "����"
};
const checkCode = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
const sexCode = { 0: "Ů", 1: "��" };
const errorCode = {
    "100000": { message: "У��ɹ���", code: "100000" },
    "-100001": { message: "�����������֤���Ȼ��ʽ����", code: "-100001" },
    "-100002": { message: "�������֤�����Ƿ�!", code: "-100002" },
    "-100003": { message: "����֤�ϵĳ������ڷǷ�!", code: "-100003" },
    "-100004": { message: "�����������֤�ŷǷ�!", code: "-100004" }
};
const codeReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
function error(code) {
    const key = String(code);
    return Object.assign({
        code: "-100001",
        message: "��֤ʧ��",
        status: false
    }, errorCode[key] || {});
}
function success() {
    return Object.assign({
        code: "100000",
        message: "��֤�ɹ�",
        status: true
    }, errorCode["100000"] || {});
}
/**
 * У������֤�����Ƿ�Ϸ�
 */
function IDCodeTest(idcode) {
    if (!codeReg.test(idcode)) {
        return error("-100001");
    }
    idcode = idcode.toUpperCase();
    if (!areaID[parseInt(idcode.substr(0, 2))]) {
        return error("-100002");
    }
    const sBirthday = idcode.substr(6, 4) +
        "-" +
        Number(idcode.substr(10, 2)) +
        "-" +
        Number(idcode.substr(12, 2));
    const d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday !==
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()) {
        return error("-100003");
    }
    if (parseInt(idcode.substr(6, 4)) > new Date().getFullYear() ||
        parseInt(idcode.substr(6, 4)) < 1900) {
        return error("-100003");
    }
    let iSum = 0;
    for (let i = 17; i >= 1; i--) {
        iSum +=
            ((Math.pow(2, i) % 11) *
                parseInt(idcode.charAt(17 - i), 11));
    }
    const mod = iSum % 11;
    if (mod > 11 || mod < 0) {
        return error("-100004");
    }
    if (checkCode[mod] !== idcode.charAt(17)) {
        return error("-100004");
    }
    return success();
}
class IDCard {
    constructor(idcode) {
        this.idcode = idcode;
    }
    static Test(idcode) {
        return IDCodeTest(idcode);
    }
    check() {
        return IDCard.Test(this.idcode);
    }
    /** ��������֤�Ż�ȡ�Ա� */
    sex() {
        if (this.idcode.length === 15) {
            return sexCode[parseInt(this.idcode.substring(14, 15)) % 2];
        }
        else if (this.idcode.length === 18) {
            return sexCode[parseInt(this.idcode.substring(14, 17)) % 2];
        }
        else {
            return "unknow";
        }
    }
    /** ��������֤�Ż�ȡ���� */
    birthday() {
        let birthStr = "";
        if (this.idcode.length === 15) {
            let year = parseInt(this.idcode.substr(6, 2));
            year = year < 10 ? 2000 + year : 1900 + year;
            birthStr =
                year +
                    "-" +
                    this.idcode.substr(8, 2) +
                    "-" +
                    this.idcode.substr(10, 2);
        }
        else if (this.idcode.length === 18) {
            birthStr =
                this.idcode.substr(6, 4) +
                    "-" +
                    this.idcode.substr(10, 2) +
                    "-" +
                    this.idcode.substr(12, 2);
        }
        return birthStr;
    }
    /** ��������֤�Ż�ȡ������ */
    area() {
        return areaID[parseInt(this.idcode.substr(0, 2))] || "unknow";
    }
    /** ��������֤�Ż�ȡ���� */
    age() {
        const birthStr = this.birthday();
        const r = birthStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (!r)
            return 0;
        const d = new Date(Number(r[1]), Number(r[2]) - 1, Number(r[3]));
        if (d.getFullYear() === Number(r[1]) &&
            d.getMonth() + 1 === Number(r[2]) &&
            d.getDate() === Number(r[3])) {
            const Y = new Date().getFullYear();
            return Y - Number(r[1]);
        }
        return 0;
    }
    /** ��������֤��Ϣ */
    parse() {
        const info = this.check();
        if (!info.status)
            return info;
        return {
            sex: this.sex(),
            birthday: this.birthday(),
            age: this.age(),
            area: this.area()
        };
    }
}
export default IDCard;
