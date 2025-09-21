/*
 * @Author: ※mk9007@163.com
 * @Date: 2021-02-03 14:30:22
 * @LastEditTime: 2021-02-04 09:38:50
 * @FilePath: \vue-manage\src\meview-ui\libs\util\verify\IDCode.ts
 * @Description: 身份证号码验证工具
 */

type ErrorCode = {
  message: string;
  code: string;
};

type Result = ErrorCode & {
  status: boolean;
};

const areaID: Record<number, string> = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
};

const checkCode: (string | number)[] = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];

const sexCode: Record<number, string> = { 0: "女", 1: "男" };

const errorCode: Record<string, ErrorCode> = {
  "100000": { message: "校验成功！", code: "100000" },
  "-100001": { message: "你输入的身份证长度或格式错误", code: "-100001" },
  "-100002": { message: "你的身份证地区非法!", code: "-100002" },
  "-100003": { message: "身份证上的出生日期非法!", code: "-100003" },
  "-100004": { message: "你输入的身份证号非法!", code: "-100004" }
};

const codeReg =
  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

function error(code: string | number): Result {
  const key = String(code);
  return Object.assign(
    {
      code: "-100001",
      message: "验证失败",
      status: false
    },
    errorCode[key] || {}
  );
}

function success(): Result {
  return Object.assign(
    {
      code: "100000",
      message: "验证成功",
      status: true
    },
    errorCode["100000"] || {}
  );
}

/**
 * 校验身份证号码是否合法
 */
function IDCodeTest(idcode: string): Result {
  if (!codeReg.test(idcode)) {
    return error("-100001");
  }
  idcode = idcode.toUpperCase();
  if (!areaID[parseInt(idcode.substr(0, 2))]) {
    return error("-100002");
  }

  const sBirthday =
    idcode.substr(6, 4) +
    "-" +
    Number(idcode.substr(10, 2)) +
    "-" +
    Number(idcode.substr(12, 2));
  const d = new Date(sBirthday.replace(/-/g, "/"));
  if (
    sBirthday !==
    d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
  ) {
    return error("-100003");
  }
  if (
    parseInt(idcode.substr(6, 4)) > new Date().getFullYear() ||
    parseInt(idcode.substr(6, 4)) < 1900
  ) {
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
  private idcode: string;

  constructor(idcode: string) {
    this.idcode = idcode;
  }

  static Test(idcode: string): Result {
    return IDCodeTest(idcode);
  }

  check(): Result {
    return IDCard.Test(this.idcode);
  }

  /** 根据身份证号获取性别 */
  sex(): string {
    if (this.idcode.length === 15) {
      return sexCode[parseInt(this.idcode.substring(14, 15)) % 2];
    } else if (this.idcode.length === 18) {
      return sexCode[parseInt(this.idcode.substring(14, 17)) % 2];
    } else {
      return "unknow";
    }
  }

  /** 根据身份证号获取生日 */
  birthday(): string {
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
    } else if (this.idcode.length === 18) {
      birthStr =
        this.idcode.substr(6, 4) +
        "-" +
        this.idcode.substr(10, 2) +
        "-" +
        this.idcode.substr(12, 2);
    }
    return birthStr;
  }

  /** 根据身份证号获取出生地 */
  area(): string {
    return areaID[parseInt(this.idcode.substr(0, 2))] || "unknow";
  }

  /** 根据身份证号获取年龄 */
  age(): number {
    const birthStr = this.birthday();
    const r = birthStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!r) return 0;
    const d = new Date(Number(r[1]), Number(r[2]) - 1, Number(r[3]));
    if (
      d.getFullYear() === Number(r[1]) &&
      d.getMonth() + 1 === Number(r[2]) &&
      d.getDate() === Number(r[3])
    ) {
      const Y = new Date().getFullYear();
      return Y - Number(r[1]);
    }
    return 0;
  }

  /** 解析身份证信息 */
  parse() {
    const info = this.check();
    if (!info.status) return info;
    return {
      sex: this.sex(),
      birthday: this.birthday(),
      age: this.age(),
      area: this.area()
    };
  }
}

export default IDCard;
