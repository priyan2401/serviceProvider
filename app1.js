var express=require('express');
var app=express();
var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));
var bodyParser=require('body-parser');
var mongo=require('mongodb');
var favicon = require('serve-favicon');
var nodemailer = require('nodemailer');

var MongoClient=mongo.MongoClient;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
var cors = require('cors')
app.use(cors());

var PORT= process.env.PORT || 4545

var smtpTransport = nodemailer.createTransport({
	service:'gmail',
	auth : {
		user : "vaniprasad109@gmail.com",//"goservice.org@gmail.com"
		pass : "vaniprasad@109" //goService@2016
	}
});

function getRandomCode(p) {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";
	var rand;
	var charec = '';
	for (var i = 0; i < 8; i++) {
		rand = Math.floor(Math.random() * str.length);
		charec += str.charAt(rand);
	}
	console.log(charec);
	p(charec)
}



var sess;

MongoClient.connect("mongodb://priya:priya@ds127872.mlab.com:27872/mydb", function(err, db){

	var user=db.collection("customer");
	var earn=db.collection("SuggessionBox");
	
	app.get('/', function(req, res) {
   res.sendFile(__dirname+'/public'+'/login.html');
});
	
app.post('/login', function (req, res) {
	sess = req.session;
	var email=req.body.email;
	var password=req.body.password;
	user.find({"email":email,"password":password}).toArray(function(err,result){
		sess.result=result
		if(sess.result)
	{
		response={
				"output":sess.result
				 }
				res.json(response)
	}
	else
	{
		error={
				"output":err
			  }
				console.log(error)
				res.json(error);
	}
	});
});

//Forgot Password Module
app.post('/forgotPassword',function(req, res) {
	app.use(cors());
	console.log('forgot'+req.body);
	var email=req.body.email;
	//var Email1 = JSON.stringify(req.body.email);
	console.log(email);
	var randomPassword;
	getRandomCode(function(resp){
	randomPassword=resp;	
	});
	user.find({"email":email}).toArray(function(err, data){
		if(data){
			
			console.log('data',data);
				var loginJson = JSON.stringify(data);
				var loginStringJSON = JSON.parse(loginJson);
				console.log("checking"+loginStringJSON[0].email)
             if(email==loginStringJSON[0].email){
				// sending random password to mail here
				var mailOptions = {
					from : "vaniprasad109@gmail.com",
					to : email,
					subject : "Re: Password Forgotten Request from goservice",
					text : "Your new Password is : " + randomPassword
				};
				console.log(mailOptions);
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						console.log(error);
						res.end("error");
					} else {
						console.log(response);
						res.end("sent");
					}
				});
				console.log("Modified"+loginStringJSON[0]);
				user.update({"email":loginStringJSON[0].email},{$set:{"password":randomPassword}},function(err,result){
					if(err)
						console.log(err);
					else{
		                 response={
				             "output":result
				                  }
				         console.log(response)
				         //res.json(response)
                         res.send("<p>New Password has been sent to your mail!</p>");						 
					    }
				    });
}
		}
		
	else{
		error={"output":err}
		res.json(error)
	}	
	})	
	});
	
	//Reset Password
	app.post('/resetpassword', function(req, res) {
    app.use(cors());
	var email= req.body.email;
	var oldpword = req.body.oldPassword;
	var newpword = req.body.newPassword;
	console.log(email);
	console.log(newpword);
	user.find({"email":email}).toArray(function(err, data) {
		if (data) {
					var loginJson = JSON.stringify(data);
					var loginStringJSON = JSON.parse(loginJson);
					console.log("checking"+loginStringJSON[0].email)
					console.log("checking"+loginStringJSON[0].password)
					if (oldpword == loginStringJSON[0].password) {
						user.update({"email":loginStringJSON[0].email},{$set:{"password":newpword}},function(err,result) {
							if(result)
	                           {
		                        response={
				                 "output":result
				                         }
				                  console.log(response)
				                  res.json(response)
	                           }
	                        else
	                           {
		                        error={
				                   "output":err
			                          }
				                    console.log(error)
				                    res.json(error);
	                           }
                           });
					}
		}else
	                           {
		                        error={
				                   "output":err
			                          }
				                    console.log(error)
				                    res.json(error);
							   }
	});					   
});

//Registrations for customer and service man

app.post('/register1', function(req, res) {
	app.use(cors());
	var name         = req.body.name;
	var email        = req.body.email;
	var Password     = req.body.password;
	var desig        = req.body.desig;
	var ServiceDesig = req.body.ServiceDesig;
	var address      = req.body.address;
	var city         = req.body.city;
	var pincode      = req.body.pincode;
	var phone        = req.body.phone;
	var docId        = req.body.email;
	console.log("data");
	if(desig=="customer"){
		console.log("welcome to registration")
		user.insert({
		
		"name"     : name,
		"email"    : email,
		"password" : Password,
	    "desig"    : desig,
		"address"  : address,
		"city"     : city,
		"pincode"  : pincode,
		"phone"    : phone
	}, function(err, data) {
		if (err) {
			{
		        error={
				 "output":err
			          }
				console.log(error)
				res.json(error);
			}
		}
		else (data) 
			{
		        response={
				 "output":data
			          }
				console.log(response)
				res.json(response);
				//res.redirect("customerProfile.html");
			}
	});
	}else {
		user.insert({
		
		"name"     : name,
		"email"    : email,
		"password" : Password,
	    "desig"    : desig,
		"ServiceDesig"  : ServiceDesig,
		"address"  : address,
		"city"     : city,
		"pincode"  : pincode,
		"phone"    : phone
	}, function(err, data) {
		if (err) {
			{
		        error={
				 "output":err
			          }
				console.log(error)
				res.json(error);
			}
		}
		else (data) 
			{
		        response={
				 "output":data
			          }
				console.log(response)
				res.json(response);
				//res.redirect("customerProfile.html");
			}
	});
	}
	
});



//Getting available service Men

app.post('/Filter', function(req, res) {
	console.log("data searching");
	var ServiceDesig= req.body.ServiceDesig;
	var pincode = req.body.pincode;
	console.log(pincode);

	user.find({'ServiceDesig' : ServiceDesig,'pincode' : pincode}).toArray(function(err, result) {
		
		//console.log("available",result);
       if(result)
	   {
				console.log("from app.js",JSON.stringify(result));
				response={"output":result}
				console.log("data after json:",response)
				res.json(response)
       }
       else
	   {
	           error={
				 "output":err
			          }
				console.log(error)
				res.json(error);
       }	 

	});

});

app.post('/sugg',function(req,res){
	console.log("welcome in sugg api");
	var email=req.body.email;
	var suggession=req.body.suggession;
	var docid=email;
	earn.insert({
		
		"email"     : email,
		"suggession"  : suggession
		
	}, function(err, data) {
		if (err) {
			{
		        error={
				 "output":err
			          }
				console.log(error)
				res.json(error);
			}
		}
		else (data) 
			{
		        response={
				 "output":data
			          }
				console.log(response)
				res.send(response);
			}
	});
	
});

});
app.listen(PORT,function(){
	console.log("server is running on :" + PORT);
});