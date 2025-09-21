import messages from './messages';
const required = (val) => {
    return (val != null && String(val).trim() !== '') || messages.required;
};
export default required;
