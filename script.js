 let values = []; // this is the array where we would store the data from api

 let heightScale;
 let xScale;
 let xAxisScale;
 let yAxisScale;

 let width = 800;
 let height = 600;
 let padding = 40;

 let svg = d3.select('svg');

 let drawChart = () => {
  svg.attr('width', width)
      .attr('height', height)
 } 

 let generateScales = () => {
  heightScale = d3.scaleLinear()
                  .domain([0, d3.max(values, (item) => {
                      return item[1]
                  })])
                  .range([0, height - (2 * padding)])

  xScale = d3.scaleLinear()
              .domain([0, values.length - 1])
              .range([padding, width - padding]) 

   let datesArr = values.map(item => {
      return new Date(item[0]);
   })  
   console.log(datesArr)

   xAxisScale = d3.scaleTime()
                  .domain([d3.min(datesArr), d3.max(datesArr)])
                  .range([padding, width - padding])
  yAxisScale = d3.scaleLinear()
                  .domain([0, d3.max(values, (item) => {
                      return item[1]
                  })])
                  .range([height - padding, padding])

 }

 let drawBars = () => {
  let tooltip = d3.select('body')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('visibility', 'hidden')
                  .style('width', 'auto')
                  .style('height', 'auto')

  svg.selectAll('rect')
      .data(values)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', (width - (2 * padding)) / values.length)
      .attr('data-date', (item) => {
          return item[0];
      })
      .attr('data-gdp', (item) => {
          return item[1];
      })
      .attr('height', (item) => {
          return heightScale(item[1])
      })
      .attr('x', (item, index) => {
          return  xScale(index)
      })
      .attr('y', (item) => {
          return (height - padding) - heightScale(item[1])
      })
      .on('mouseover', (item, index) => {

          tooltip.style('visibility', 'visible')
          .html(`Date: ${index[0]} Data: <b>${index[1]}</b>`)
          .attr('data-date', index[0])

      })

      .on('mouseout', (item) => {
           tooltip.style('visibility', 'hidden')
      })
 }
 let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale)

  svg.append('g')
  .call(xAxis)
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${height - padding})`);

  let yAxis = d3.axisLeft(yAxisScale);

  svg.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr('transform', `translate(${padding}, 0)`)
 }


 fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
 .then(res => res.json())
 .then(data => {
  values = data.data
  console.log(values)
  drawChart()
  generateScales()
  drawBars()
  generateAxes()
 });


