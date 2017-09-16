import * as d3 from '../d3.exports.js';

/**
 * @return {object} The tooltip.
 */
export function createTooltip() {
  const tooltip = d3.select('.tooltip');

  return {
    setText({Doping, Name, Nationality, Time, Year}) {
      const tooltipText = `<p>${Name} (${Nationality})</p>
        <p>Year: ${Year}, Time: ${Time}</p>
        ${Doping ? `<p>${Doping}</p>` : ''}`;

      tooltip.html(tooltipText);
      return this;
    },
    show() {
      tooltip.classed('tooltip-isActive', true);
      return this;
    },
    hide() {
      tooltip.classed('tooltip-isActive', false);
      return this;
    }
  };
}
