class Stock
  attr_accessor :ticker
  
  def initialize(ticker)
    @ticker = ticker
  end

  def random
    # generate a number against a constant date x coordinate and
    # return to react, not firebase
    # also need to generate a color somehow
    # add the name of the stock too
    stock_data = {}
    stock_data[:ticker] = @ticker
    stock_data[:color] = 'blue'
    stock_data[:data] = [['2016-01-01'], ['2016-01-02'], ['2016-01-03']]
    stock_data[:data].length.times do |i|
      stock_data[:data][i][1] = Random.rand(1...100)
    end
    return stock_data
  end
  
  def self.get_data
    ticker_list = JSON.parse(FB.get('/stocks/').response.body).keys
    puts "stock_list: #{ticker_list}"
    stocks_data = []
    ticker_list.each do |t|
      stock = Stock.new(t)
      stock_data = stock.random
      stocks_data.push(stock_data)
    end
    return stocks_data
  end
end