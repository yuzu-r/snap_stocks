class Stock
  attr_accessor :ticker
  
  def initialize(ticker)
    @ticker = ticker.to_s
  end

  def bundle
    stock_data = {}
    stock_data[:ticker] = @ticker
    quandl_data = self.quandl
    stock_data[:data] = quandl_data
    return stock_data
  end
  
  def quandl
    #https://www.quandl.com/api/v3/datatables/WIKI/PRICES/metadata.json?api_key=b6kb-Zw_JtEH-hEX76jD
    #qopts.columns=ticker,date,close
    #url = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=20160101&date.lt=20160110&ticker=MSFT,FB&qopts.columns=ticker,date,close&api_key=b6kb-Zw_JtEH-hEX76jD'
    #@result = Net::HTTP.get(URI.parse(url))
    #puts "#{@result}"
    #https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=b6kb-Zw_JtEH-hEX76jD
    #"https://www.quandl.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=2014-01-01&end_date=2014-12-31&collapse=monthly&api_key=b6kb-Zw_JtEH-hEX76jD"
    key = ENV["quandl_api_key"]
    api_key = 'api_key=' + key
    column_index = 'column_index=4'
    base_url = 'https://www.quandl.com/api/v3/datasets/WIKI/'
    today = Time.now
    end_date = 'end_date='+today.strftime('%F')
    start_date = 'start_date='+(today-90.days).strftime('%F')
    url = base_url + @ticker + '.json?' + '&' + column_index + '&' + start_date + '&' + end_date + '&' + api_key
    result = Net::HTTP.get(URI.parse(url))
    json_result = JSON.parse(result)
    quandl_data = json_result['dataset']['data']

=begin
    quandl data is    
    [["2016-01-15", 39.77], ["2016-01-14", 40.47], ["2016-01-13", 40.4], etc
=end
    return quandl_data
  end

  def self.get_data  
    response = JSON.parse(FB.get('/').response.body)
    ticker_list = response["stocks"].keys
    #time_period = response["selectedTimePeriod"]
    #puts "stock_list: #{ticker_list}"
    #puts "time period: #{time_period}"
    # write the time period +/- 1 day for a little margin
    today = Time.now
    end_date = (today+1).strftime('%F')
    start_date = (today-91.days).strftime('%F')
    # write the time to FB for D3 to consume
    FB.update('/', {start_date: start_date, end_date: end_date})
    stocks_data = []
    ticker_list.each do |t|
      stock = Stock.new(t)
      stock_data = stock.bundle
      stocks_data.push(stock_data)
    end
    return stocks_data
  end
end