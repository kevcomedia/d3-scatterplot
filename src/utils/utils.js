/**
 * Converts number of seconds into a human-readable format (i.e., mm:ss).
 * 
 * Example: toHumanReadableTime(70) => '01:10'
 *
 * @param {number} rawSeconds The number of seconds to convert.
 * @return {string} A human-readable representation of the input.
 */
export function toHumanReadableTime(rawSeconds = 0) {
  /**
   * Returns a zero-padded string if the string is only one char.
   * @param {string} string The string to zero-pad.
   * @return {string} The zero-padded string.
   */
  function zeroPad(string = '') {
    return ''.padStart.call(string, 2, '0');
  }

  const minutes = zeroPad(Math.floor(rawSeconds / 60));
  const seconds = zeroPad(rawSeconds % 60);

  return `${minutes}:${seconds}`;
}
