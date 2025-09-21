import messages from './messages';
const between = (val, min, max) => {
    const n = Number(val);
    const minNum = Number(min);
    const maxNum = Number(max);
    return (n >= minNum && n <= maxNum) || messages.between(minNum, maxNum);
};
export default between;
