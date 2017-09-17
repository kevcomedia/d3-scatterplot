import * as d3 from './d3.exports.js';
import cyclistData from '../data/cyclist-data.json';

import {createTooltip} from './tooltip/tooltip.js';
import {toHumanReadableTime} from './utils/utils.js';

const width = 1000;
const height = 500;
const padding = {
  bottom: 70,
  left: 50,
  right: 120,
  top: 10
};

const dopingColor = {
  true: 'red',
  false: 'black'
};

const times = d3.extent(cyclistData, ({Seconds}) => Seconds);
const places = d3.extent(cyclistData, ({Place}) => Place);

const xScale = d3.scaleLinear()
  .domain([0, times[1] - times[0] + 10])
  .range([width - padding.right, padding.left]);

const yScale = d3.scaleLinear()
  .domain([places[0], places[1] + 1])
  .range([padding.top, height - padding.bottom]);

const chart = d3.select('#chart')
  .attr('width', width)
  .attr('height', height);

const tooltip = createTooltip();

const point = chart.selectAll('g')
  .data(cyclistData)
  .enter()
  .append('g')
  .attr('transform',
    ({Seconds, Place}) =>
      `translate(${xScale(Seconds - times[0])}, ${yScale(Place)})`)
  .on('mouseover', (d) => {
    tooltip
      .setText(d)
      .show();
  })
  .on('mouseout', () => {
    tooltip.hide();
  });

point.append('circle')
  .attr('r', 5)
  .attr('fill', ({Doping}) => dopingColor[!!Doping]);

point.append('text')
  .attr('x', 15)
  .attr('dy', '.35em')
  .text(({Name}) => Name);

// Bottom axis
chart.append('g')
  .attr('transform', `translate(0, ${height - padding.bottom})`)
  .call(d3.axisBottom(xScale).tickFormat(toHumanReadableTime));

chart.append('text')
  .attr('x', width - padding.right)
  .attr('y', height - padding.bottom - 5)
  .style('text-anchor', 'end')
  .text('Minutes Behind Fastest Time');

// Left axis
chart.append('g')
  .attr('transform', `translate(${padding.left}, 0)`)
  .call(d3.axisLeft(yScale));

chart.append('text')
  .attr('x', -padding.top)
  .attr('y', padding.left + 20)
  .attr('transform', 'rotate(-90)')
  .style('text-anchor', 'end')
  .text('Rank');

addLegend(chart, {
  text: 'Doping Allegations',
  fill: dopingColor.true,
  pos: 4
});
addLegend(chart, {
  text: 'No Doping Allegations',
  fill: dopingColor.false,
  pos: 5
});

/**
 * Appends a legend on the chart with the given details.
 *
 * @param {object} chart The chart to append a legend to.
 * @return {object} The legend.
 */
function addLegend(chart, {text = '', fill = '', parts = 6, pos = 0} = {}) {
  const legend = chart.append.call(chart, 'g')
    .attr(
      'transform',
      `translate(${pos * width / parts}, ${height - (padding.bottom / 2)})`);

  legend.append('circle')
    .attr('r', 5)
    .attr('fill', fill);

  legend.append('text')
    .attr('x', 15)
    .attr('dy', '.35em')
    .text(text);

  return legend;
}
