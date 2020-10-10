export function getKeyByValue(object: any, value: number): string | undefined {
    return Object.keys(object).find(key =>
        object[key] === value);
}

export function uniqueId() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let guid = [u.substr(0, 8), u.substr(8, 4), '4000-8' + u.substr(13, 3), u.substr(16, 12)].join('-');
    return guid;
}
