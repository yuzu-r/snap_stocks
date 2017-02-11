BASE_URI = ENV["firebase_database_url"] + "/"
STOCKS_URI = BASE_URI + "/stocks/"
FB = Firebase::Client.new(BASE_URI)