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

const legend = {
  allegation: chart.append('g'),
  noAllegation: chart.append('g')
};

legend.allegation
  .attr(
    'transform',
    `translate(${4 * width / 6}, ${height - padding.bottom + 35})`);

legend.allegation
  .append('circle')
  .attr('r', 5)
  .attr('fill', dopingColor.true);

legend.allegation
  .append('text')
  .attr('x', 15)
  .attr('dy', '.35em')
  .text('Doping Allegations');

legend.noAllegation
  .attr(
    'transform',
    `translate(${5 * width / 6}, ${height - padding.bottom + 35})`);

legend.noAllegation
  .append('circle')
  .attr('r', 5)
  .attr('fill', dopingColor.false);

legend.noAllegation
  .append('text')
  .attr('x', 15)
  .attr('dy', '.35em')
  .text('No Doping Allegations');
