import * as d3 from './d3.exports.js';
import cyclistData from '../data/cyclist-data.json';

import {toHumanReadableTime} from './utils.js';

const width = 1000;
const height = 500;
const padding = {
  bottom: 50,
  left: 50,
  right: 50,
  top: 50
};

const minTime = d3.min(cyclistData, ({Seconds}) => Seconds);
const maxTime = d3.max(cyclistData, ({Seconds}) => Seconds);

const xScale = d3.scaleLinear()
  .domain([0, maxTime - minTime])
  .range([width - padding.right, padding.left]);

const yScale = d3.scaleLinear()
  .domain([
    d3.min(cyclistData, (d) => d.Place),
    d3.max(cyclistData, (d) => d.Place),
  ])
  .range([padding.top, height - padding.bottom]);

const chart = d3.select('#chart')
  .attr('width', width)
  .attr('height', height);

chart.append('g')
  .attr('transform', `translate(0, ${height - padding.bottom})`)
  .call(d3.axisBottom(xScale).tickFormat(toHumanReadableTime));

chart.append('g')
  .attr('transform', `translate(${padding.left}, 0)`)
  .call(d3.axisLeft(yScale));

chart.selectAll('circle')
  .data(cyclistData)
  .enter()
  .append('circle')
  .attr('r', 5)
  .attr('fill', ({Doping}) => Doping ? 'red' : 'black')
  .attr('cx', ({Seconds}) => xScale(Seconds - minTime))
  .attr('cy', ({Place}) => yScale(Place));
