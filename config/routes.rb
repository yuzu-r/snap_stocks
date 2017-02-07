Rails.application.routes.draw do
root 'static_pages#show'
get 'firebase_info' => 'static_pages#firebase_info'
get 'prices' => 'static_pages#fetch_prices'
end
