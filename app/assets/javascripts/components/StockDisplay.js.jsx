var StockDisplay = React.createClass({
  onClick: function(){
    console.log('clicked span');
  },
  render: function(){
    var self = this;
    var stocks = this.props.stockData.map(function(s, index){
      var divStyle = {backgroundColor: s.color};
          return(
            <div key={index} className='stock-label' style={divStyle}>
              {s.ticker}
              <span className='stock-button glyphicon glyphicon-trash' 
                    aria-label="click to delete"
                    onClick={self.props.removeStock.bind(null, s.ticker)}></span>
            </div>
          )
        });
    return (
      <div className='stock-list'>
        {stocks}
      </div>
    )
  }
});
