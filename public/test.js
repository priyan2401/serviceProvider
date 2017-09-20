var app = angular.module("myApp",['ngRoute', 'ngStorage']);

app.config(function($routeProvider) {
    //Adds a new route definition to the $route service
    //$routeProvider to map a view with a controller
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'loginController'
        })
		.when('/register1', {
            templateUrl: 'registration.html',
            controller: 'regController'
        })
		.when('/reset', {
            templateUrl: 'reset.html',
            controller: 'resetController'
        })
		.when('/Filter', {
            templateUrl: 'customerProfile.html',
            controller: 'customer'
        })
		.when('/servicemen', {
            templateUrl: 'serProfile.html',
            controller: 'servicemen'
        })
		.when('/profile', {
            templateUrl: 'profile.html',
            controller: 'profile'
        })
		.when('/profile1', {
            templateUrl: 'profile1.html',
            controller: 'profile1'
        })
		.when('/sugg', {
            templateUrl: 'sugg.html',
            controller: 'sugg'
        })
        .otherwise({
            redirectTo: '/login'
        });
});
	
app.controller("loginController", function($window,$scope,$http,$location,$sessionStorage) {
    $scope.login = function() {
			alert("working");
        var email = $scope.email;
		alert(email);
        var password = $scope.password;
		$window.alert(email+" "+password)
		console.log(email+password);
      var data={ 
	  
	   "email":email,
	   "password":password
	}
	console.log("object:"+data.email+"\n"+data.password);
		$http.post('https://'+window.location.hostname+':4545/login',data).then(function(response){
			$window.alert(JSON.stringify(response));
	     if(response.data.output.length!=0){
			 if(response.data.output[0].desig=="customer"){
				 $window.alert("welcome Customer"+response.data.output[0].email);
				 $window.localStorage.setItem("customer",JSON.stringify(response.data.output[0]));
				 alert("valid Credentials");
            $location.path("/Filter" );
        } else {
            $window.alert("welcome ServiceMan"+response.data.output[0].email);
		     $window.localStorage.setItem('profileService',JSON.stringify(response.data.output))
				 $window.alert("local storage successfull");
			$location.path("/servicemen" );
        }
    }
	else{
		alert("wrong Credentials");
	}
		});
	}
	//Forgot password controller
	$scope.click=function(){
		 alert("working");
        var email = $scope.email;
		alert(email);
		console.log("object:"+email);
		var d={"email":email}
		$http.post('https://'+window.location.hostname+':4545/forgotPassword',d).then(function(response){
			alert(JSON.stringify(response));
		console.log('hey');
			if(response.data.error== undefined){
				$window.alert("new password send to ur registered mail");
			}else{
				$window.alert("check the email once");
			}
	 });
}
    $scope.set=function(){
		$location.path("/reset");
	}
	
	    $scope.reg=function(){
		$location.path("/register1");
	}
});
//reset password controller
app.controller("resetController", function($window,$scope,$http,$location) {
	$scope.reset = function(){
	var email=$scope.email;
	var oldPassword=$scope.oldPassword;
	var newPassword=$scope.newPassword;
	alert(email+" "+oldPassword+""+newPassword);
	var d={
		"email":email,
		"oldPassword":oldPassword,
	   "newPassword":newPassword
	}
	$http.post('https://'+window.location.hostname+':4545/resetPassword',d).then(function(response){
			alert(JSON.stringify(response));
		console.log('hey');
			if(response.data.error== undefined){
				$window.alert("new password updated");
				$location.path("/login");
			}else{
				$window.alert("wrong Email");
			}
	 });
	}
});

//Registration Controller

app.controller("regController", function($window,$scope,$http,$location,$rootScope) {
	$scope.desigs=["customer", "serviceMan"];
	$scope.ServiceDesigs=["carpenter","Electrician","Interior-Designer","Plumber","HomeWorker"];
	$scope.doReg = function(){
		alert($scope.email);

	var name=$scope.name;
	var email=$scope.email;
	var password=$scope.password;
	var desig=$scope.desig;
	var ServiceDesig=$scope.ServiceDesig;
	var address=$scope.address;
	var city=$scope.city;
	var pincode=$scope.pincode;
	var phone=$scope.phone;
	var d={
		"name"          : name,
		"email"         : email,
		"password"      : password,
	    "desig"         : desig,
		"ServiceDesig"  : ServiceDesig,
		"address"       : address,
		"city"          : city,
		"pincode"       : pincode,
		"phone"         : phone
	}
	
	alert(JSON.stringify(d))
	$http.post('https://'+window.location.hostname+':4545/register1',d).then(function(response){
			alert(JSON.stringify(response.data.output));
		console.log('hey');
			if(response.data.error== undefined){
				$window.alert("Registration successfull");
				$location.path("/login");
			}else{
				$window.alert("Again Register");
			}
	 });
	 }
	
});

//Filter Data 

app.controller("customer", function($window,$scope,$http,$location,$localStorage) {
	$scope.serviceTypes=["carpenter","Electrician","Interior-Designer","Plumber","Home=Worker"];
	var cdata=JSON.parse($window.localStorage.getItem('customer'));
	var name=cdata.name;
	$scope.name=name;
	$scope.search = function(){
	var ServiceDesig=$scope.ServiceDesig;
	var pincode=$scope.pincode;
	alert(ServiceDesig+pincode);
	var d={
		"ServiceDesig":ServiceDesig,
		"pincode":pincode,
	}
	$http.post('http://'+window.location.hostname+':4545/Filter',d).then(function(response){
			alert(JSON.stringify(response));
		console.log('hey');
			if(response.data.error== undefined){
				$window.alert("Service Available");
			
				$scope.res=response.data.output

			}else{
				$window.alert("No Such service is Available");
			}
	 });
	}
	$scope.continue=function(){
		$window.alert("click button worked");
		var cdata=JSON.parse($window.localStorage.getItem('customerInfo'))
		        alert(cdata.name+" "+cdata.address+""+cdata.city+""+cdata.pincode+""+cdata.phone)
				/*var name=cdata.name;
				var address=cdata.address;
				var pincode=cdata.pincode
				var city=cdata.city;
				var phone=cdata.phone;
				 var e={"name":name,"address":address,"pincode":pincode,"city":city,"phone":phone}
	            $http.post('http://localhost:4545/sdata',e).then(function(res)
              {
                  if(res.data.output.length!=0)
                  {
					 //$scope.details=res.data.output;
					 $scope.cinfo=res.data.output;
					   console.log(JSON.stringify(res.data.output))
					   var x=res.data.output
					   $window.localStorage.setItem('customerInfo',JSON.stringify(x))
					   $window.alert("Your Request has been send to the serviceman")
					  
			      }
                  else
                  {
                      alert("Failed");
                  }
              }) */
			  $scope.cinfo=cdata;
				$window.alert("Your Request has been send to the serviceman") 
	  
	}
	
	$scope.profile=function(){
		$location.path("/profile");
	}
	
	$scope.sugg=function(){
		$location.path("/sugg");
	}
});

app.controller("servicemen", function($window,$scope,$http,$location,$localStorage) {
	//$scope.serviceTypes=["carpenter","Electrician","Interior-Designer","Plumber","Home=Worker"];
	var sdata=JSON.parse($window.localStorage.getItem('profileService'));
	console.log(sdata[0].name)
	var sname=sdata[0].name;
	$scope.name=sname;
	
	 $scope.profile1=function(){
		$location.path("/profile1");
	}
	
	 $scope.clist=function(){
		$location.path("/profile1");
	}
	
	
	
});

app.controller("profile", function($window,$scope,$http,$location,$localStorage) {
	//$scope.serviceTypes=["carpenter","Electrician","Interior-Designer","Plumber","Home=Worker"];
		
	var qdata=JSON.parse($window.localStorage.getItem('customer'));
	console.log("customer info"+JSON.stringify(qdata));
	 var name=qdata.name;
	 $scope.name=name;
	 $scope.serv=qdata;
	 //console.log($scope.serv)
	
});

app.controller("profile1", function($window,$scope,$http,$location,$localStorage) {
	//$scope.serviceTypes=["carpenter","Electrician","Interior-Designer","Plumber","Home=Worker"];
		
	var ndata=JSON.parse($window.localStorage.getItem('profileService'));
	console.log("Working"+JSON.stringify(ndata));
	 $scope.ninfo=ndata;
	 
	 var reqdata=JSON.parse($window.localStorage.getItem('customer'));
	console.log("Mani"+JSON.stringify(reqdata));
	 $scope.cinfo=reqdata;
	
});

app.controller("sugg", function($window,$scope,$http,$location,$localStorage) {
	console.log("working sugg controller");
	var pdata=JSON.parse($window.localStorage.getItem('customer'));
	var name=pdata.name;
	$scope.name=name;
		$scope.clist1=function(){
	console.log("Working customer"+JSON.stringify(pdata));
	 var email=pdata.email;
	 var suggession=$scope.suggession;
	 var s={
		 "email":email,
		 "suggession":suggession
	 }
	 $http.post('https://'+window.location.hostname+':4545/sugg',s).then(function(response){
			alert(JSON.stringify(response));
		console.log('hey');
			if(response.data.error== undefined){
				$window.alert("Thanks for ur suggession");
			}else{
				$window.alert("Leave it, Thank you");
			}
	 });
	 
		} 
	
});

