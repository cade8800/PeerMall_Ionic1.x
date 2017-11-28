angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($httpProvider) {
    /*    function Base64_Encode(str) {
     var c1, c2, c3;
     var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
     var i = 0, len = str.length, string = '';

     while (i < len) {
     c1 = str.charCodeAt(i++) & 0xff;
     if (i === len) {
     string += base64EncodeChars.charAt(c1 >> 2);
     string += base64EncodeChars.charAt((c1 & 0x3) << 4);
     string += "==";
     break;
     }
     c2 = str.charCodeAt(i++);
     if (i === len) {
     string += base64EncodeChars.charAt(c1 >> 2);
     string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
     string += base64EncodeChars.charAt((c2 & 0xF) << 2);
     string += "=";
     break;
     }
     c3 = str.charCodeAt(i++);
     string += base64EncodeChars.charAt(c1 >> 2);
     string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
     string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
     string += base64EncodeChars.charAt(c3 & 0x3F);
     }
     return string;
     }*/
    /*    $.ajax({
     type: "POST",
     url: "/token",
     data: {'grant_type': 'client_credentials'},
     /!*      data: {'grant_type': 'client_credentials', 'client_Id': '1234', 'client_Secret': '5678'},*!/
     contentType: "application/json; charset=utf-8",
     dataType: "json",
     beforeSend: function (xhr) {
     /!*xhr.setRequestHeader("Authorization", 'Basic ' + Base64_Encode('60fb274dd72149e7873b2d686a1a95a0:UutMallMobileByEedc'));*!/
     xhr.setRequestHeader("Authorization", 'Basic NjBmYjI3NGRkNzIxNDllNzg3M2IyZDY4NmExYTk1YTA6VXV0TWFsbE1vYmlsZUJ5RWVkYw==');
     },
     success: function (data, status) {
     $httpProvider.defaults.headers.common = {'Authorization': 'bearer ' + data.access_token};
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
     console.info(XMLHttpRequest.status);
     console.info(XMLHttpRequest.readyState);
     console.info(textStatus);
     },
     complete: function () {
     }
     });*/
  })

  .config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }])

  .factory("httpInterceptor", ["$q", "$injector", function ($q, $injector) {
    return {
      /*      "request": function (config) {
       var loading = $injector.get('$ionicLoading');
       loading.show();
       return config || $q.when(config);
       },
       "requestError": function (rejection) {
       return $q.reject(rejection);
       },
       "response": function (reponse) {
       var loading = $injector.get('$ionicLoading');
       loading.hide();
       return reponse || $q.when(reponse);
       },*/
      "responseError": function (response) {
        var loading = $injector.get('$ionicLoading');
        if (response.status == 401) {
          var msg = response.data.Message;
          if (msg == "notlogin") {
            loading.show({template: '您还未登录，现在跳转至登录页面', duration: 1500});

            var http = $injector.get('$http');
            var currentUrl = window.location.href;
            http.post('/api/Account/LoginUrl').then(function (response) {
              window.location.href = response.data + "?returnurl=" + currentUrl;
            });

          } else if (msg == "notagency") {
            loading.show({template: '请切换为机构身份登录浏览', duration: 1500});

            var http = $injector.get('$http');
            var currentUrl = window.location.href;
            http.get('/api/Account/getUrl').then(function (response) {
              window.location.href = response.data[0];
            });
          }
          return $q.reject(response);
        }
        else if (response.status == 404) {
          loading.show({template: '404', duration: 1500});
          return $q.reject(response);
        }
        else if (response.status == 500) {
          loading.show({template: '500', duration: 1500});
          return $q.reject(response);
        }
      }

    }
  }
  ])

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    //解决 Android tab 样式问题
    $ionicConfigProvider.tabs.style('standard'); // Tab风格
    $ionicConfigProvider.tabs.position('bottom'); // Tab位置
    $ionicConfigProvider.navBar.alignTitle('center'); // 标题位置
    $ionicConfigProvider.navBar.positionPrimaryButtons('left'); // 主要操作按钮位置
    $ionicConfigProvider.navBar.positionSecondaryButtons('right'); //次要操作按钮位置

    // //禁止侧滑后退事件
    // $ionicConfigProvider.views.swipeBackEnabled(false);

  })

  .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    /*隐藏ion-nav-back-button中文本 start*/
    $ionicConfigProvider.backButton.text("");
    $ionicConfigProvider.backButton.previousTitleText(false);
    /*隐藏ion-nav-back-button中文本 end*/

    $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'views/layout/tabs.html',
        controller: "TabCtrl"
      })

      /*tab-home*/
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('tab.product', {
        url: '/home/product/:typeName/:condition',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-product.html',
            controller: 'ProductListCtrl'
          }
        }
      })
      .state('tab.line', {
        url: '/home/line/:productID',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-line.html',
            controller: 'LineDetailCtrl'
          }
        }
      })
      .state('tab.hotel', {
        url: '/home/hotel/:productID',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-hotel.html',
            controller: 'HotelDetailCtrl'
          }
        }
      })
      .state('tab.ticket', {
        url: '/home/ticket/:productID',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-ticket.html',
            controller: 'TicketDetailCtrl'
          }
        }
      })
      .state('tab.map', {
        url: '/map/:longitude/:latitude',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('tab.consulting', {
        url: '/consulting',
        views: {
          'tab-home': {
            templateUrl: 'views/home/tab-consulting.html',
            controller: 'ConsultingCtrl'
          }
        }
      })

      /*tab-supplier*/
      .state('tab.supplier', {
        url: '/supplier',
        views: {
          'tab-supplier': {
            templateUrl: 'views/supplier/tab-supplier.html',
            controller: 'SupplierCtrl'
          }
        }
      })
      .state('tab.supplier-home', {
        url: '/supplier/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/supplier/tab-supplier-home.html',
            controller: 'SupplierHomeCtrl'
          }
        }
      })
      .state('tab.notice', {
        url: '/notice/:Id',
        views: {
          'tab-supplier': {
            templateUrl: 'views/supplier/tab-notice.html',
            controller: 'NoticeCtrl'
          }
        }
      })
      .state('tab.notice-detail', {
        url: '/notice/:agencyId/:Id',
        views: {
          'tab-supplier': {
            templateUrl: 'views/supplier/tab-notice-detail.html',
            controller: 'NoticeDetailCtrl'
          }
        }
      })

      .state('tab.supplier-product', {
        url: '/home/product/:typeName/:agencyId/:condition',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-product.html',
            controller: 'ProductListCtrl'
          }
        }
      })
      .state('tab.supplier-line', {
        url: '/home/line/:productID/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-line.html',
            controller: 'LineDetailCtrl'
          }
        }
      })
      .state('tab.supplier-hotel', {
        url: '/home/hotel/:productID/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-hotel.html',
            controller: 'HotelDetailCtrl'
          }
        }
      })
      .state('tab.supplier-ticket', {
        url: '/home/ticket/:productID/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-ticket.html',
            controller: 'TicketDetailCtrl'
          }
        }
      })
      .state('tab.supplier-map', {
        url: '/map/:longitude/:latitude/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('tab.supplier-consulting', {
        url: '/consulting/:agencyId',
        views: {
          'tab-supplier': {
            templateUrl: 'views/home/tab-consulting.html',
            controller: 'ConsultingCtrl'
          }
        }
      })

      /*tab-supplieryellowpage*/
      .state('tab.supplier-yellowpage', {
        url: '/supplieryellowpage',
        views: {
          'tab-supplieryellowpage': {
            templateUrl: 'views/yellowpage/tab-yellowpage.html',
            controller: 'SupplieryellowpageCtrl'
          }
        }
      })

      /*tab-account*/
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'views/account/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })

    ;

    $urlRouterProvider.otherwise('/tab/home');

  });
