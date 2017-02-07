STOCKS_URI = ENV["firebase_database_url"] + "/stocks/"
FB = Firebase::Client.new(STOCKS_URI)