angular.module('shortly', [
  'shortly.services',
  'shortly.links',
  // 'shortly.custs',   // this seems to make it worse, even though it surely must be required
  'shortly.shorten',
  'shortly.auth',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider

    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })

    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    
    .when('/custs', {
      templateUrl: 'app/custs/custs.html',
      controller: 'CustsController',
      authenticate: true
    })

    .when('/links', {
      templateUrl: 'app/links/links.html',
      controller: 'LinksController',
      authenticate: true
    })

    .when('/shorten', {
      templateUrl: 'app/shorten/shorten.html',
      controller: 'ShortenController',
      authenticate: true
    })

    .otherwise({
      redirectTo: '/links'
    });
    
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
  //  --- MH sez $httpProvider.interceptors.push('AttachTokens');
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
  $httpProvider.defaults.useXDomain = true; 
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    console.log("app is alive");
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});