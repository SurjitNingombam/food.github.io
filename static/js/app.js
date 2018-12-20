(function() {

var app = angular.module("foodApp", ["ngRoute",'duScroll']); 

// global variables declaration
var apiKey = 'b93cefcb3edd28df9543ef1bd64c07e4';

// routes defined
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html",
        controller : "homeController"
    })
    .when("/details/id/:res_id", {
        templateUrl : "views/details.html",
        controller : "detailsController"
    });
});

// homeController for 1st page
app.controller('homeController',function($scope, $http){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude; 
            var lon = position.coords.longitude;

            $http({
                method : "GET",
                url: "https://developers.zomato.com/api/v2.1/geocode",
                headers: {'user_key' : apiKey},
                params: {
                    lat: lat, 
                    lon: lon
                }
            })
            .then(function(response) {
                $scope.data = response.data;
                $scope.restList = response.data.nearby_restaurants;
            
            },function(response) {
                //Second function handles error
                $scope.content = "Something went wrong";
            });

        });
    }
    else{
        alert("Your browser doesn't support navigator.geolocation!")
    }

    $scope.listView = function() {
        $scope.viewClass="list-group-item";
    };

    $scope.gridView = function() {
        $scope.viewClass="grid-group-item";
    };
    
});

// detailsController for the 2nd page
app.controller('detailsController',function($scope, $document, $window, $http, $location, $anchorScroll, $routeParams){

    var res_id = $routeParams.res_id;
    
    // get restuarant details
    $http({
        method : "GET",
        url: "https://developers.zomato.com/api/v2.1/restaurant",
        headers: {'user_key' : apiKey},
        params: {
            res_id: res_id
        }
    })
    .then(function(response) {
        $scope.resDetails = response.data;
    
    },function(response) {
        //Second function handles error
        $scope.content = "Something went wrong";
    });

    // get restuarant dailymenu
    $scope.resDailymenu = [
        {name:"Bestseller",list:[
            {item:'Paneer Chilli',price:175,type:'veg',desc:"Paneer cooked with green chillis"},
            {item:'Egg Bhurji',price:110,type:'semi',desc:"Brown eggs cooked with tomato"},
            {item:'Chicken Kebab',price:195,type:'nonveg',desc:"Afgahni style chicken kebab"}
        ]},
        {name:"Combos",list:[
            {item:'Non Veg Curry Combo',price:185,type:'nonveg',desc:"Andhra chicken curry with red chillis"},
            {item:'Paneer Curry Combo',price:170,type:'veg',desc:"Panner cooked with palak"},
            {item:'Egg Fried Rice Combo',price:165,type:'semi',desc:"Basmatic rice with eggs"}
        ]},
        {name:"Main Course",list:[
            {item:'Butter Chicken Masala',price:225,type:'nonveg',desc:"Butter added in chicken curry"},
            {item:'Soya Curry',price:180,type:'veg',desc:"Soya chunks curry"},
            {item:'Dal Tadka',price:140,type:'veg',desc:"Dal in punjabi way"}
        ]},
        {name:"Deserts",list:[
            {item:'Gulab Jamum',price:155,type:'veg',desc:"Some sweets for you"},
            {item:'Carrot Halwa',price:100,type:'veg',desc:"Indian favourite halwa"},
            {item:'Mysore Pak',price:150,type:'veg',desc:"Famous Mysure snack"}
        ]},
    ];
    // $http({
    //     method : "GET",
    //     url: "https://developers.zomato.com/api/v2.1/dailymenu",
    //     headers: {'user_key' : apiKey},
    //     params: {
    //         res_id: res_id
    //     }
    // })
    // .then(function(response) {
    //     $scope.resDailymenu = response.data;
    
    // },function(response) {
    //     //Second function handles error
    //     $scope.content = "Something went wrong";
    // });

    // get restuarant reviews
    $http({
        method : "GET",
        url: "https://developers.zomato.com/api/v2.1/reviews",
        headers: {'user_key' : apiKey},
        params: {
            res_id: res_id,
            start:'',
            count:20
        }
    })
    .then(function(response) {
        $scope.resReviews = response.data;
    
    },function(response) {
        //Second function handles error
        $scope.content = "Something went wrong";
    });
    
    var offset = 100; //pixels; adjust for floating menu, context etc
    var duration = 1000; //milliseconds
    $scope.scrollTo = function(id) {
        
        //Scroll to #some-id with 30 px "padding"
        //Note: Use this in a directive, not with document.getElementById 
        var someElement = angular.element(document.getElementById(id));
        $document.scrollToElement(someElement, offset, duration);
    }

});

})();