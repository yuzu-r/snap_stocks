var Smoke = React.createClass({
  getInitialState: function(){
    return (
      {
        stockList: [],
        stock: ''
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
          var stocksObject = snapshot.val().wip;
          var runningStockList = [];
          for (var stock in stocksObject) {
            runningStockList.push(stock);
            $.ajax({
              type: 'GET',
              url: '/length',
              dataType: 'json',
              data: {ticker: stock},
              success: function(response){
                //console.log('setting length to fb', response);
              },
              error: function(response){
                console.log('errro setting legnth to fb', response.responseText);
              }
            })
          }          
          self.setState({stockList: runningStockList});
          self.drawChart();
        })
      }
    })    
  },
  componentWillUnmount: function(){
    firebase.off();
  },
  drawChart: function(){
    console.log('in drawChart');
    var maxHeight = 450, maxWidth = 480;
    
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = maxWidth - margin.left - margin.right,
      height = maxHeight - margin.top - margin.bottom;
    
    var data=[{name: 'black', color: 'black',data: [['2016-01-01', 5], ['2016-01-02', 2], ['2016-01-03',3]]},
          {name: 'green',color: 'green',data: [['2016-01-01', 4], ['2016-01-02', 12], ['2016-01-03',6]]}];

    var parseDate = d3.timeParse("%Y-%m-%d");
    
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
    var xRange = d3.scaleTime()
              .range([0,width])
              .domain([parseDate(minDate), parseDate(maxDate)])
    var yRange = d3.scaleLinear()
                .range([height, 0])
                .domain([0,getYDomainMax(data)]); 

    var xAxis = d3.axisBottom()
      .scale(xRange)

    var yAxis = d3.axisLeft()
      .scale(yRange)

    var line = d3.line()
      .x(function(d) { return xRange(parseDate(d[0])); })
      .y(function(d) { return yRange(d[1]); });  
     
    var svg = d3.select("#chart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('d',function(d){ return line(d.data);})
      .attr('stroke', function(d) { return d.color; });
      
    svg.append("g")         // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")         // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);
  },
  onSubmitStock: function(e){
    e.preventDefault();
    var stock = this.state.stock;
    this.setState(
      {
        stock: ''
      }
    );
    var stockRef = firebase.database().ref("wip").child(stock);
    stockRef.update({greeting: 'hi'});
  },  
  onUpdateStock: function(e){
    this.setState({stock: e.target.value});
  }, 
  removeStock: function(stock){
    //console.log('removing', stock);
    firebase.database().ref('wip').child(stock).remove();
  },  
  render(){
    return (
      <div>
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

