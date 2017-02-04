STOCKS_URI = ENV["firebase_database_url"] + "/wip/"
FB = Firebase::Client.new(STOCKS_URI)