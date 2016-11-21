<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/
// Home page
Route::group(['middleware' => ['web']], function () {
	Route::get('/', array(
		'as' => 'home',
		'use' => 'HomeController@index'));

	// Result page
	Route::get('search', ['as' => 'search', 'uses' => 'HomeController@searchResult']);

	Route::post('booking/flight', 'BookingController@redirectToBookingFlight')->middleware('checklogin');
	Route::post('booking/hotel', 'BookingController@redirectToBookingHotel')->middleware('checklogin');

	Auth::routes();

	Route::post('booking/postHotel', 'BookingController@postBookingHotel')->middleware('checklogin');

	Route::post('booking/postFlight', 'BookingController@postBookingFlight')->middleware('checklogin');

	Route::get('report/{tourId}', 'ReportController@getReport')->middleware('checklogin');

	Route::get('payment', 'PaypalController@postFlightPayment');
	// this is after make the payment, PayPal redirect back to your site
	Route::get('payment/status/flight', array(
	    'as' => 'payment.status.flight',
	    'uses' => 'PaypalController@saveFlightPayment',
	));
});
