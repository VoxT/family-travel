<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Cache;

class BookingController extends Controller
{

    public function redirectToBookingFlight(Request $request)
    {
    	return View('pages.flightbooking')->with('flightDetails', $request->details)->with('tourId', $request->tourId);
    }

    public function redirectToBookingHotel(Request $request)
    {
        return View('pages.hotelbooking')->with('hotelDetails', $request->details)->with('tourId', $request->tourId);
    }

    public function redirectToBookingCar(Request $request)
    {
    	return View('pages.carbooking')->with('carDetails', $request->details)->with('tourId', $request->tourId);
    }

    public function postBookingFlight()
    { 
        $flight_details = (array) json_decode(\Session::get('flightDetails'));
        $tourId = \Session::get('tourID');

        $input = $flight_details['input'];
        $flights = $flight_details['flight'];

        // create flight round trip
        $id = DB::table('flight_round_trip')->insertGetId(
            ['cabin_class' => $input->cabinClass,
             'number_of_seat' => $input->adults,
             'price' => $flights->Price,
             'full_name' => \Session::get('user_name'),
             'phone' => \Session::get('user_phone'),
             'email' => \Session::get('user_email'),
             'gender' => 'other',
             'tour_id' => $tourId,
             'payment_id' => \Session::get('paypal_payment_id')
             ]
        );	

        // create flight
        foreach ($flights as $key => $flight) {
            if($key === 'Price') continue;
            else
            foreach ($flight->segment as $index => $segment) {
                DB::table('flights')->insert(
                    ['origin_place' => $segment->originName,
                     'destination_place' => $segment->destinationName,
                     'origin_code' => $segment->originCode,
                     'destination_code' => $segment->destinationCode,
                     'departure_datetime' => new \DateTime($segment->departureDate.' '.$segment->departureTime),
                     'arrival_datetime' =>  new \DateTime($segment->arrivalDate.' '.$segment->arrivalTime),
                     'flight_number' => $segment->flightCode.$segment->flightNumber,
                     'carrier_logo' => $segment->imageUrl,
                     'carrier_name' => $segment->imageName,
                     'type' => $key,
                     'index' => $index,
                     'round_trip_id' => $id,
                     ]
                );  
            }
        }

        return $id;
    }

    public function postBookingHotel()
    {

        $hoteldetails = (array)json_decode(\Session::get('hotelDetails')); 

        $tourId = \Session::get('tourID');

        (object)$input = $hoteldetails['input'];

        (object)$hotel = $hoteldetails['hotel'];

        $reviews = json_encode($hotel->reviews);

        
         DB::table('hotels')->insert(
            [
                'check_in_date' => $input->checkindate,
                'check_out_date' => $input->checkoutdate,
                'guests' => $input->guests,
                'rooms' => $input->rooms,
                'price' => $hotel->price_total,
                'policy' => json_encode($hotel->policy),
                'room_type' =>$hotel->room->type_room,
                'reviews' => $reviews,
                'name' => $hotel->hotel->name,
                'description' => $hotel->hotel->description,
                'location' => $hotel->hotel->address,
                'popularity' => $hotel->hotel->popularity,
                'amenities' => json_encode($hotel->hotel->amenities),
                'latitude' => $hotel->hotel->latitude,
                'longitude' =>$hotel->hotel->longitude,
                'star_rating' => $hotel->hotel->star_rating,
                'image_url' => json_encode($hotel->hotel->image_url),
                'full_name' => \Session::get('user_name'),
                'email' => \Session::get('user_email'),
                'address' => \Session::get('address'),
                'phone' => \Session::get('user_phone'),
                'gender' => 'other',
                'tour_id' =>  $tourId
            ]);
    }

    public function postBookingCar(Request $request)
    {

        return redirect('/report'.'/'.$request->tourId);
    }
}
