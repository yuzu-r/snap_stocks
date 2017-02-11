class StaticPagesController < ApplicationController
  def show
    @stocks = JSON.parse(FB.get('/stocks/').response.body).keys 
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
    # get the data for 1 year, allow user to narrow the time period within react
    stocks_data = Stock.get_data
    render json: {:success => "success", :status_code => "200", :stock_data => stocks_data}
  end
end