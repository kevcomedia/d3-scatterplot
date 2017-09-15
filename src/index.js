import * as d3 from './d3.exports.js';
import cyclistData from '../data/cyclist-data.json';

import {toHumanReadableTime} from './utils.js';

const width = 1000;
const height = 500;
const padding = {
  bottom: 50,
  left: 50,
  right: 120,
  top: 50
};

const minTime = d3.min(cyclistData, ({Seconds}) => Seconds);
const maxTime = d3.max(cyclistData, ({Seconds}) => Seconds);

const minPlace = d3.min(cyclistData, ({Place}) => Place);
const maxPlace = d3.max(cyclistData, ({Place}) => Place);

const xScale = d3.scaleLinear()
  .domain([0, maxTime - minTime + 10])
  .range([width - padding.right, padding.left]);

const yScale = d3.scaleLinear()
  .domain([minPlace, maxPlace + 1])
  .range([padding.top, height - padding.bottom]);

const chart = d3.select('#chart')
  .attr('width', width)
  .attr('height', height);

const tooltip = d3.select('.tooltip');

const point = chart.selectAll('g')
  .data(cyclistData)
  .enter()
  .append('g')
  .attr('transform',
    ({Seconds, Place}) =>
      `translate(${xScale(Seconds - minTime)}, ${yScale(Place)})`)
  .on('mouseover', ({Doping, Name, Nationality, Time, Year}) => {
    const tooltipText = `<p>${Name} (${Nationality})</p>
      <p>Year: ${Year}, Time: ${Time}</p>
      ${Doping ? `<p>${Doping}</p>` : ''}`;

    tooltip.html(tooltipText);
    tooltip.classed('tooltip-isActive', true);
  })
  .on('mouseout', () => {
    tooltip.classed('tooltip-isActive', false);
  });

point.append('circle')
  .attr('r', 5)
  .attr('fill', ({Doping}) => Doping ? 'red' : 'black');

point.append('text')
  .attr('font-size', 11)
  .attr('x', 15)
  .attr('dy', '.35em')
  .text(({Name}) => Name);

chart.append('g')
  .attr('transform', `translate(0, ${height - padding.bottom})`)
  .call(d3.axisBottom(xScale).tickFormat(toHumanReadableTime));

chart.append('g')
  .attr('transform', `translate(${padding.left}, 0)`)
  .call(d3.axisLeft(yScale));
