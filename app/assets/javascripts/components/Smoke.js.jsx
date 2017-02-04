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
        })
      }
    })    
  },
  componentWillUnmount: function(){
    firebase.off();
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
      </div>
    )
  }
});

