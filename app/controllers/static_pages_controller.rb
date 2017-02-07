class StaticPagesController < ApplicationController
  def show
    @greeting = 'hi'
    key = ENV["quandl_api_key"]
    #https://www.quandl.com/api/v3/datatables/WIKI/PRICES/metadata.json?api_key=b6kb-Zw_JtEH-hEX76jD
    #ticker, date, close
    #qopts.columns=ticker,date,close
    #url = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=20160101&date.lt=20160110&ticker=MSFT,FB&qopts.columns=ticker,date,close&api_key=b6kb-Zw_JtEH-hEX76jD'
    #@result = Net::HTTP.get(URI.parse(url))
    #puts "#{@result}"
    #@stocks = JSON.parse(FB.get('/wip/').response.body).values  # => { 'name' => "-INOQPH-aV_psbk3ZXEX" }
    @stocks = JSON.parse(FB.get('/stocks/').response.body).keys 
    puts "show controller: #{@stocks}"
  end
  def firebase_info
    render json: {:success => "success", :status_code => "200", 
        :config => {:apiKey => ENV["firebase_api_key"], 
                    :authDomain => ENV["firebase_auth_domain"],
                    :databaseURL => ENV["firebase_database_url"],
                    :storageBucket => ENV["firebase_storage_bucket"]
                    }
                  }    
  end

  def fetch_prices
    stocks_data = Stock.get_data
    render json: {:success => "success", :status_code => "200", :stock_data => stocks_data}
  end
end