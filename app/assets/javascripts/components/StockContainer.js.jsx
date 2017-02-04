var StockContainer = React.createClass({
  render: function(){
    return (
      <div>
        <form onSubmit={this.props.handleSubmitStock}>
          <div className = "form-group">
            <input
              className="form-control"
              placeholder="Enter a stock symbol"
              onChange={this.props.handleUpdateStock}
              value={this.props.stock}
              type="text" />
          </div>
          <div className="form-group col-sm-4 col-sm-offset-4">
            <button
              className="btn btn-block btn-success"
              type="submit">
                Enter
            </button>
          </div>
        </form>       
        <p>This will be container for adding and displaying stocks.</p>
        <StockDisplay stocks={this.props.stockList} removeStock={this.props.removeStock} />
      </div>
    )
  }
});
