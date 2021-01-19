
$(document).ready(function(){
  var api_key= "4e6c0474be6165dd35b8450501c8bd83"

   var searchHistory = JSON.parse(localStorage.getItem("history"))|| []
 
   // to get current weather data
   
  function getWeather(cityName){
  
  query_url = "http://api.openweathermap.org/data/2.5/weather?&q="+ cityName+ "&appid="+ api_key
 // to get temp,humidity and wind speed
  $.ajax({url: query_url, method:"GET"}).done(function(weatherData){
   setStorage(weatherData);
   clear();
   
   var date = weatherData.dt;
    $(date).addClass("ml-3")
   date = moment().format("L")
   
   var imgIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+ weatherData.weather[0].icon+"@2x.png")
   $("#temp-div").append("<h2>"+cityName+" "+"(" + date+ ")"+"</h2>");
   $("h2").append(imgIcon)
   var tempF = (weatherData.main.temp-273.15)*1.8 +32
  $("#temp-div").append("<h5> Temperature: "+ tempF.toFixed(1)+"'F </h5>")
  var humidity = weatherData.main.humidity;
  $("#temp-div").append("<h5> Humidity: "+ humidity + "% </h5>")
  var windSpeed = weatherData.wind.speed;
  $("#temp-div").append("<h5> Wind Speed: "+windSpeed+" MPH </h5>")
  //  to get uv index
  var lat = weatherData.coord.lat
  var lon = weatherData.coord.lon
  // queryurl to get uv index
  var uv_url = "http://api.openweathermap.org/data/2.5/uvi?appid=4e6c0474be6165dd35b8450501c8bd83&q=&lat="+lat +"&lon="+ lon
  
  $.ajax({url:uv_url, response:"GET"}).done(function(response){
    var uvI = $("<h5>").text("Uv Index: ")
   var uv_val =$("<span></span>").text(response.value)
  
   if($(uv_val).text()<=2){
     $(uv_val).addClass("bg-success  p-1 rounded text-light")
   } else if($(uv_val).text()>2 || uv_val<=8){
     $(uv_val).addClass("bg-warning p-1 rounded")
   } else if($(uv_val).text()>8){
     $(uv_val).addClass("bg-danger p-1 rounded text-light")
   }
  
   $(uvI).append(uv_val)
   $("#temp-div").append(uvI)
  })
    
  
  // 5 days forecast
    url = "https://api.openweathermap.org/data/2.5/forecast?appid=4e6c0474be6165dd35b8450501c8bd83&q=" +cityName
    $.ajax({url:url, method:"Get"}).done(function(res){
      var data = res.list
      // $("#fiveday-container").empty()
     for(i=0; i<data.length; i=i+8){
       var dt =moment(data[i].dt_txt).format("L")
     
       var dailyCard = $("<div></div>").addClass("card bg-primary m-3 p-2");
       var dailyDate = $("<h5></h5>").addClass("card-title text-light").text(dt)
       var icon = $("<img>").attr("src","http://openweathermap.org/img/wn/"+data[i].weather[0].icon+"@2x.png")
       var calTemp = (data[i].main.temp-273.5)*1.8+32
       var dailyTemp = $("<h5></h5>").text("Temp: "+calTemp.toFixed(1)+"'F").addClass("text-light text-center")
       var dailyHumidity = $("<h5></h5>").text("Humidity: "+data[i].main.humidity+ "%").addClass("text-light text-center")
       
       $(dailyCard).append(dailyDate, icon, dailyTemp, dailyHumidity);
       $("#fiveday-container").append(dailyCard)
     }
     })
  })
  }
 
  
  // sets localstorage with the cityname
  function setStorage(weatherData){
   var cityName = weatherData.name;
   var history = {city: cityName}
  
   
   if(searchHistory === null){
    localStorage.setItem("history",JSON.stringify([{city:cityName}]))
    
   }else{
     searchHistory.push(history)
     localStorage.setItem("history",JSON.stringify(searchHistory))
     createList(cityName);
   }
  
   
  }
  // function to create a city list
  function createList(cityName){
   var city_li=$("<li></li>").addClass("list-group-item list-group-item-action").text(cityName);
   $("#city-history").prepend(city_li)
   
  }
//  function to get last searched city persistent on the page from localStorage
 if(searchHistory.length>0){
   for(i=0;i<searchHistory.length; i++){
     createList(searchHistory[i].city)
   }
   getWeather(searchHistory[searchHistory.length-1].city)
 }


  
  // function to clear the elements for every search
  function clear(){
    $("#temp-div").empty()
    $("#fiveday-container").empty()
  }
  
  // event listener to get the value of city input
  $("#searchBtn").on("click", function(event){
  event.preventDefault();
  clear()
  var cityName= $("#cityName").val().trim();
  $("#cityName").val("")
 getWeather(cityName)
  })
 
  // event-listener on previous search cities list
  $("#city-history").on("click","li" ,function(){
   clear()
   getWeather($(this).text())
  })

})
