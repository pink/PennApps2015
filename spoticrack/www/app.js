// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ionic.contrib.ui.tinderCards' is found in ionic.tdcards.js

var flag = true;
var card_scope;
var audioObject = null;
var lastCard;
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('spot-login', {
      url: "/spot-login",
      views: {
        '': {
          templateUrl: "spot-login.html"
        }
      }
    })
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "menu.html"
    })
    .state('menu.main', {
      url: "/main",
      views: {
        'menuContent' :{
          templateUrl: "main.html",
        }
      }
    })
    .state('menu.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "settings.html"
          //controller: "AttendeesCtrl"
        }
      }
    })
    .state('menu.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "about.html"
          //controller: "AttendeesCtrl"
        }
      }
    })
  
  $urlRouterProvider.otherwise("/spot-login");
})

.directive('noScroll', function() {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $element.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, TDCardDelegate) {
  card_scope = $scope;
  var cardTypes = [
    {image: 'red.jpg', artist: 'Taylor Swift', title: 'I Knew You Were Trouble'}
  ];


  $scope.cards = [];

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };
  for(var i = 0; i < 1; i++) $scope.addCard();

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT2 SWIPE');
    $scope.cards.pop();
    stop();
  };
  $scope.cardSwipedRight = function(index, card) {
    addToMusic(card.id);
    if ($scope.cards.length < 4){
      setSeed("artist", card.artist, card_scope);
    }
    $scope.cards.pop();
    stop();
  };  
  $scope.cardDestroyed = function(index, card) {
    lastCard = $scope.cards.pop();
    console.log('Card Removed');
    console.log(card.title);
    stop();
  };
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $timeout) {
  if (flag == false){
      flag=true;
      showPopup($scope, $timeout, $ionicPopup);
  }
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  // Triggered on a button click, or some other target
});

function toggle(source) {
  checkboxes = document.getElementsByName('pref');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
  if (flag == true){
    flag = false;
  }
  else{
    flag = true;
  }
  console.log(flag);
}

function showPopup(scope, timeout, ionicPopup) {
   scope.data = {}

   // An elaborate, custom popup
   var myPopup = ionicPopup.show({
     template: '<div class="list"><label class="item item-radio"><input type="radio" name="group" ng-model="data.type" value="artist"><div class="item-content">Artist</div><i class="radio-icon ion-checkmark"></i></label><label class="item item-radio"><input type="radio" name="group" ng-model="data.type" value="genre"><div class="item-content">Genre</div><i class="radio-icon ion-checkmark"></i></label><label class="item item-input"><input type="text" ng-model="data.text" placeholder="Search..."></label></div>',
     scope: scope,
     buttons: [
       {
         text: '<b>Go</b>',
         type: 'button-positive',
         onTap: function(e) {
          if (!scope.data.text) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return scope.data;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
    setSeed(res.type, res.text, card_scope);
    setTimeout(function(){console.log("BACK"); console.log(card_scope.cards);card_scope.$apply();}, 5500);
   });
   timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 10000000);
}


function play(){
  if (!audioObject){
    console.log(card_scope.cards[card_scope.cards.length - 1].song);
    audioObject = new Audio(card_scope.cards[card_scope.cards.length - 1].song);
    audioObject.play();
  }
}

function stop(){
  if (audioObject){
    audioObject.pause();
    audioObject = null;
  }
}

function doRefresh() {
  if (card_scope.cards.length == 0){
    setSeed("artist", lastCard.artist, card_scope);
    card_scope.$apply();
  }
  card_scope.$apply();
};

