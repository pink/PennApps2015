// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ionic.contrib.ui.tinderCards' is found in ionic.tdcards.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('spot-login', {
      url: '/spot-login',
      templateUrl: 'spot-login.html',
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
  var cardTypes = [
    { image: 'max.jpg', title: 'max' },
    { image: 'ben.png', title: 'ben' },
    { image: 'perry.jpg', title: 'perry' },
    {image: 'red.jpg', title: 'red'}
  ];

  $scope.cards = [];

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };
  for(var i = 0; i < 3; i++) $scope.addCard();

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT2 SWIPE');
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
  };  
  $scope.cardDestroyed = function(index, card) {
    $scope.cards.splice(index, 1);
    console.log('Card Removed');
    console.log(card.title);
  };
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
});

function toggle(source) {
  checkboxes = document.getElementsByName('pref');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}