var StockContainer = React.createClass({
  render: function(){
    return (
      <div>
        <div className='input-group'>
          <input placeholder='Enter a stock symbol' 
                  value={this.props.stock}
                  onChange={this.props.handeUpdateStock}
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
        <p>This will be container for adding and displaying stocks.</p>
        <StockDisplay stocks={this.props.stockList} removeStock={this.props.removeStock} />
      </div>
    )
  }
});
