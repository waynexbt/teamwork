export function truncateToTwoDecimals(number) {
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1 || decimalIndex + 3 > numberString.length) {
      return numberString;
    }
    return numberString.slice(0, decimalIndex + 3);
  }