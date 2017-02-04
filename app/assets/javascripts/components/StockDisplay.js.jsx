var StockDisplay = React.createClass({
  render: function(){
    var self = this;
    var stocks = this.props.stocks.map(function(s, index){
          return(
            <li key={index}>
              {s}
              <button onClick={self.props.removeStock.bind(null, s)}>
                remove me
              </button>
            </li>
          )
        });
    return (
      <ul>Current Stock List:
        {stocks}
      </ul>
    )
  }
});
