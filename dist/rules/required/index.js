const required = (val) => {
    return (val != null && String(val).trim() !== '');
};
export default required;
