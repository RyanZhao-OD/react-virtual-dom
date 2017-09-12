function lvenshteinDistance(str1, str2) {
    const str1Length = str1.length;
    const str2Length = str2.length;
    if (str2Length === 0) {
        return str1Length;
    } else if (str1Length === 0) {
        return str2Length;
    } else if (str1.charAt(str1Length - 1) === str2.charAt(str2Length - 1)) {
        return lvenshteinDistance(str1.substr(0, str1Length - 1), str2.substr(0, str2Length - 1))
    } else {
        return Math.min(
            lvenshteinDistance(str1.substr(0, str1Length - 1), str2) + 1,
            lvenshteinDistance(str1, str2.substr(0, str2Length - 1)) + 1,
            lvenshteinDistance(str1.substr(0, str1Length - 1), str2.substr(0, str2Length - 1)) + 1
        );
    }
}

console.log(lvenshteinDistance('abc', 'aeabc'));