export function formatAmountWithCommas(amount) {
    if (typeof amount !== 'number') {
      return 'Invalid input';
    }
    
    // Convert the number to a string and use regex to format it with commas
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }