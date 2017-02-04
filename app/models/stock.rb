class Stock
  attr_accessor :ticker
  
  def initialize(ticker)
    @ticker = ticker
  end

  def length
    # compute the length of the ticker symbol and store it in firebase
    stock_uri = STOCKS_URI + @ticker
    FB.update(stock_uri, {length: @ticker.length})
  end
end