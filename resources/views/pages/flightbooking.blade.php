@extends('layouts.master')
@section('title', 'Trang Đặt Chỗ')

@section('content')
<div class="container" style="padding-top: 62px;">

	<div class="page-header">
        <h1 id="timeline">Đặt Vé Máy Bay</h1>
    </div>
	<ul class="timeline col-md-10 col-md-offset-1">
	    <li class="timeline-inverted">
		     <div class="timeline-badge flight"><i class="fa fa-plane" aria-hidden="true"></i></div>
		     <div class="timeline-panel">
		        <div class="timeline-heading">
		        </div>
		        <div class="timeline-body" id="flight-booking">
		          	<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
						<div class="panel panel-default  col-md-7">
					       	<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
							    <div class="panel-heading" role="tab" id="headingOne">
							      <h4 class="panel-title clearfix">
							          <div class="col-md-12">
							          		<h4>Bay từ {{$flightDetails['flight']->Outbound->overall->originName}} tới {{$flightDetails['flight']->Outbound->overall->destinationName}}</h4>
							          </div>
							          <div class="col-md-12">
							          		<h4>Tổng giá <span>{{number_format($flightDetails['flight']->Price,0,",",".")}}<sup>đ</sup></span></h4>
							          </div>
							      </h4>
							    </div>
					        </a>

						    <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
						      <div class="panel-body">
							    <div class="details" id="flightdetailsmodal">
							    	<br/>
									<div class="details-row">
										<h3 class="row-title"><b>Lượt đi</b> {{$flightDetails['input']->outboundDate}}</h3>
										@php ( $oSegment = $flightDetails['flight']->Outbound->segment )
										@foreach($oSegment as $i => $flight)
										<div class="details-content">
											<div class="content-info">
												<div class="info-cell">
													<h4>{{$flight->originName}}</h4>
            										<h5 class="hop-location">{{$flight->originCode}}</h5>
													<h5>{{$flight->departureTime}}</h5>
												</div>
												<div class="info-cell">
													<span><i class="fa fa-plane" aria-hidden="true" style="transform: rotate(45deg); margin-left: 10px"></i></span>
													<h4>{{$flight->destinationName}}</h4>
													<h5 class="hop-location">{{$flight->destinationCode}}</h5>
													<h5>{{$flight->arrivalTime}}</h5>        					
												</div>
												<div class="info-cell">
													<h5>Thời gian bay</h5>
													<h5>{{$flight->duration_h}}  giờ :  {{$flight->duration_m}}  phút</h5>        					
												</div>
											</div>
								        	<div class="carrier">
								        		<div class="flight-logo">
													<img src="{{$flight->imageUrl}}" atl="{{$flight->imageName}}">
												</div>
								        		<span>{{$flight->imageName.' - '.$flight->flightCode.$flight->flightNumber}}</span>
								        	</div>
										</div>
										@if(($i+1) < count($oSegment)) 
											@php $stoptime = 
												(new DateTime($oSegment[$i + 1]->departureDate. ' ' .$oSegment[$i + 1]->departureTime))
												->diff(new DateTime($oSegment[$i]->arrivalDate . ' ' . $oSegment[$i]->arrivalTime))
												->format("%H giờ : %I phút")
											@endphp
											<div class="stop-time">Điểm dừng chờ: <strong> {{ $oSegment[$i]->destinationName }}</strong> <span> 
														{{$stoptime}} </span></div>
										@endif
										@endforeach
									</div>

							    	<br/>
									
									<div class="details-row">
										<h3 class="row-title"><b>Lượt về</b> {{$flightDetails['input']->inboundDate}}</h3>
										@php ( $iSegment = $flightDetails['flight']->Inbound->segment )
										@foreach($iSegment as $i => $flight)
										<div class="details-content">
											<div class="content-info">
												<div class="info-cell">
													<h4>{{$flight->originName}}</h4>
            										<h5 class="hop-location">{{$flight->originCode}}</h5>
													<h5>{{$flight->departureTime}}</h5>
												</div>
												<div class="info-cell">
													<span><i class="fa fa-plane" aria-hidden="true" style="transform: rotate(45deg); margin-left: 10px"></i></span>
													<h4>{{$flight->destinationName}}</h4>
													<h5 class="hop-location">{{$flight->destinationCode}}</h5>
													<h5>{{$flight->arrivalTime}}</h5>        					
												</div>
												<div class="info-cell">
													<h5>Thời gian bay</h5>
													<h5>{{$flight->duration_h}}  giờ :  {{$flight->duration_m}}  phút</h5>        					
												</div>
											</div>
								        	<div class="carrier">
								        		<div class="flight-logo">
													<img src="{{$flight->imageUrl}}" atl="{{$flight->imageName}}">
												</div>
								        		<span>{{$flight->imageName.' - '.$flight->flightCode.$flight->flightNumber}}</span>
								        	</div>
										</div>
										@if(($i+1) < count($iSegment)) 
											@php
											$stoptime = 
												(new DateTime($iSegment[$i + 1]->departureDate. ' ' .$iSegment[$i + 1]->departureTime))
												->diff(new DateTime($iSegment[$i]->arrivalDate . ' ' . $iSegment[$i]->arrivalTime))
												->format("%H giờ : %I phút")
											@endphp
											<div class="stop-time">Điểm dừng chờ: <strong> {{ $iSegment[$i]->destinationName }}</strong> <span> 
														{{$stoptime}}</span></div>
										@endif
										@endforeach
										<br>
										
									</div>
								</div>
						      </div>
						   	</div>
						 </div>

					<form action="/booking/postFlight" method="post" id="flightbook" enctype='application/json'>
							 {{ csrf_field() }}
							<input type="hidden" name="flightdetails" value="">
						
						<div class="col-md-5" style="padding-left: 30px;">
							<div class="form-group">
								<label for="full_name" class="control-label">Họ Tên</label>
								<div class="">
									<input class='form-control' data-type="input" type='text' name='full_name' id='full_name' value ='{{Auth::user()->full_name}}' required />
								</div>
							</div>
							<div class="form-group">
								<label for="email" class="control-label">Email</label>
								<div class="">
									<input class='form-control' data-type="input" type='text' name='email' id='email' value ='{{Auth::user()->email}}' required />
								</div>
							</div>
							<div class="form-group">
								<label for="phone" class="control-label">Số Điện Thoại</label>
								<div class="">
									<input class='form-control' data-type="input" type='text' name='phone' id='phone' value ='{{Auth::user()->phone}}' required/>
								</div>
							</div>
							<div class="form-group">
								<label for="address" class="control-label">Địa Chỉ</label>
								<div class="">
									<input class='form-control' data-type="input" type='text' name='address' id='address' value ='{{Auth::user()->address}}' />
								</div>
							</div>
							<div class="form-group">
		                        <div class="">
		                            <button type="submit" class="btn btn-primary col-md-12" id="book">
		                                Giữ Chỗ
		                            </button>
		                        </div>
		                    </div>
							<div class="form-group">
		                        <div class="">
		                            <button type="submit" class="btn btn-primary col-md-12" id="payment">
		                                Đặt và Thanh Toán
		                            </button>
		                        </div>
		                    </div>
						</div>

					</form>
		      		</div>
		     	</div>
		     </div>
	   </li>
	</ul>
</div>


@endsection
@section('footer')
	@include('layouts.footer')
@endsection