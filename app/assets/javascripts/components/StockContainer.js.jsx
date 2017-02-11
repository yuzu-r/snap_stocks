var StockContainer = React.createClass({
  render: function(){
    return (
      <div>
        <div className="user-input">
          <div className='ticker'>
            <div className='input-group'>
              <input placeholder='TSLA' 
                     className='form-control'
                     type='text'
                     value={this.props.stock}
                     onChange={this.props.handleUpdateStock}>
              </input>
              <div className='input-group-btn'>
                <button 
                    className='btn btn-success'
                    onClick={this.props.handleSubmitStock}
                    >
                    Add
                </button>
              </div>
            </div>                    
          </div> 
          <div className='time'>       
            <label className="radio-inline adj-inline">
              <input type="radio" 
                     name="time-period" 
                     value='30_days' 
                     checked={this.props.selectedTimePeriod === '30_days'}
                     onChange={this.props.handleTimeChange}/>Last 30 Days
            </label>
            <label className="radio-inline adj-inline">
              <input type="radio" 
                     name="time-period" 
                     value='90_days'
                     checked={this.props.selectedTimePeriod === '90_days'}
                     onChange={this.props.handleTimeChange}/>Last 90 Days
            </label>
            <label className="radio-inline adj-inline">
              <input type="radio" 
                     name="time-period" 
                     value='365_days'
                     checked={this.props.selectedTimePeriod === '365_days'}
                     onChange={this.props.handleTimeChange} />Last Year
            </label>
          </div>
        </div>       
        <StockDisplay stockData={this.props.stockData} 
                      removeStock={this.props.removeStock} />
      </div>
    )
  }
});
