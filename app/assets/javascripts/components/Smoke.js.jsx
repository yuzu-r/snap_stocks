var Smoke = React.createClass({
  getInitialState: function(){
    return (
      {
        stockList: [],
        stock: '',
        rubyData: []
      }
    )
  },
  componentDidMount: function() {
    var self = this;
    $.ajax({
      type: 'GET', 
      url: '/firebase_info',
      dataType: 'json',
      success: function(response) {
        firebase.initializeApp(response.config);
        var stockList = [];
        firebase.database().ref().on('value', function(snapshot){
          var stocksObject = snapshot.val().stocks;
          var runningStockList = [];
          for (var stock in stocksObject) {
            runningStockList.push(stock);
          } 
          $.ajax({
            type: 'GET',
            url: '/prices',
            dataType: 'json',
            success: function(response){
              console.log('success!', response);
                function getColor(index) {
                  var colorScale = d3.schemeCategory10; 
                  return colorScale[index % colorScale.length];
                }
                response.stock_data.forEach(function(datarow, index) {
                  datarow["color"] = getColor(index);
                });

                self.setState({rubyData: response.stock_data}, self.drawChart);
            },
            error: function(response){
              console.log('failed to get prices', response.responseText);
            }
          })         
          self.setState({stockList: runningStockList});         
        });       
      }
    })    
  },
  componentWillUnmount: function(){
    firebase.off();
  },
  drawChart: function(){
    var maxHeight = 450, maxWidth = 700;
    
    var margin = {top: 30, right: 50, bottom: 40, left: 50},
      width = maxWidth - margin.left - margin.right,
      height = maxHeight - margin.top - margin.bottom;  

    var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tip')
        .style('visibility', 'hidden');
  
    var parseDate = d3.timeParse("%Y-%m-%d");

    var data = this.state.rubyData;

    data.forEach(function(datarow, index) {
      for (let i = 0; i < datarow.data.length; i++) {
        datarow.data[i][0] = parseDate(datarow.data[i][0]);
        datarow.data[i][1] = +datarow.data[i][1];
      }
    });

    var minDate = '2016-01-01';  
    var maxDate = '2016-01-03';

    var getYDomainMax = function(data){
      var currentMax = 0;
      for (var i=0; i< data.length; i++) {
        var dataset = data[i].data;
        for (var j=0; j < dataset.length; j++) {
          var currentVal = dataset[j][1];
          if (currentVal > currentMax) {
            currentMax = currentVal;
          }
        }
      }
      return currentMax;
    };
    var x = d3.scaleTime()
              .range([0,width])
              .domain([parseDate(minDate), parseDate(maxDate)])
    var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0,getYDomainMax(data)]); 

    var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.timeFormat("%m/%d"))
      .ticks(d3.timeDay);

    var yAxis = d3.axisLeft()
      .scale(y)

    var line = d3.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); });  
    
    d3.select("#prices_svg").remove();
    var svg = d3.select("#chart")
      .append("svg")
          .attr("id", "prices_svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    svg.selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('d',function(d){ return line(d.data);})
      .attr('stroke', function(d) { return d.color; })
      .on('mouseover', function(d){     
          d3.select(this).style("stroke", "black");
        })
    .on('mousemove', function(){
        d3.select(this).style("stroke", "black");
      })
    .on('mouseout', function(){
        d3.select(this).style("stroke",function(d){return d.color});
      });

    data.forEach (function(dataset, index){
      svg.selectAll('spot')
        .data(dataset.data)
        .enter().append("circle")
        .attr('r', 3)
        .attr('fill', function(d){return dataset.color;})
        .attr('cx', function(d){
          return x(d[0])
        })
        .attr('cy', function(d){ 
          return y(d[1])
        })
        .on('mouseover', function(d){     
            var tipText = '$' + d[1];
            var dateFormat = d3.timeFormat('%m/%d/%y');
            tipText += '\n ' + dateFormat(d[0]);
            tooltip.style('background-color',function(d){return dataset.color;});
            tooltip.text(tipText); 
              return tooltip.style('visibility', 'visible');
            })
        .on('mousemove', function(){
            var styleTop = (d3.event.pageY-10)+'px';
            var styleLeft = (d3.event.pageX+10)+'px';
            return tooltip.style('top', styleTop).style('left',styleLeft);
          })
        .on('mouseout', function(){
            return tooltip.style('visibility', 'hidden');
          });

      svg.selectAll('label')
        .data(dataset.data[2])
        .enter().append("text")
        .attr("x", width+5)
        .attr("y", function(d){return y(d) + 3})
        .text(function(d){return dataset.ticker});
    });
  
    svg.append("g")         // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Date");

    svg.append("g")         // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - margin.left/2)
        .style("text-anchor","middle")
        .text("Closing Price, $")
    return true;
  },
  onSubmitStock: function(e){
    e.preventDefault();
    var stock = this.state.stock;
    this.setState(
      {
        stock: ''
      }
    );
    var stockRef = firebase.database().ref("stocks").child(stock);
    stockRef.update({ticker: stock});
  },  
  onUpdateStock: function(e){
    this.setState({stock: e.target.value});
  }, 
  removeStock: function(stock){
    //console.log('removing', stock);
    firebase.database().ref('stocks').child(stock).remove();
  },  
  render(){
    return (
      <div className='col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2'>
        <p>HI from React!</p>
        <StockContainer stockList={this.state.stockList}
                        stock={this.state.stock} 
                        removeStock={this.removeStock} 
                        handleSubmitStock={this.onSubmitStock} 
                        handleUpdateStock={this.onUpdateStock}/>
        
        <div id='chart'></div>
      </div>
    )
  }
});

