var StockContainer = React.createClass({
  render: function(){
    return (
      <div>
        <div className='input-group'>
          <input placeholder='Enter a stock symbol' 
                  value={this.props.stock}
                  onChange={this.props.handleUpdateStock}
                  className='form-control'
                  type='text'>
          </input>
          <div className='input-group-btn'>
            <button 
                className='btn btn-success'
                onClick={this.props.handleSubmitStock}>
                Enter
            </button>
          </div>
        </div>
        <StockDisplay stockData={this.props.stockData} removeStock={this.props.removeStock} />
      </div>
    )
  }
});
