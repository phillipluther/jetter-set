const resolve = (expression: any) => (typeof expression === 'function' ? expression() : expression);

export default resolve;
