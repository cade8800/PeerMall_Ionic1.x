angular.module('starter.services', [])

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

  .filter("GetProductTypeLine", function () {
    return function (input) {

      var typeArray = new Array();
      typeArray = input.split('_');
      return "#/tab/home/product/" + typeArray[1];
    }
  })

  .factory("DateHelper", function () {
    return {
      //获取指定日期的前x天或后x天的日期对象
      GetDateHelp: function (currenDate, AddDayCount) {
        var dd = new Date(currenDate);
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth();//获取当前月份的日期
        var d = dd.getDate();
        //return y+"-"+m+"-"+d;
        return new Date(y, m, d);
      },
      //获取间隔天数
      GetDateDiff: function (startDate, endDate) {
        var startTime = (new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).getTime();
        var endTime = (new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).getTime();
        var dates = Math.abs(startTime - endTime) / (1000 * 60 * 60 * 24);
        return dates;
      },
      //格式化时间字符串
      FormatTimeString: function (input) {
        return new Date(parseInt(input.replace(/\D/igm, "")));
      },
      //判断当前日期是否在指定日期内
      IsDateInSpecifiedPeriod: function (currentDate, startDate, endDate) {
        var cDate = (new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())).getTime();
        var sDate = (new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).getTime();
        var eDate = (new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).getTime();

        if (cDate >= sDate && cDate < eDate) {
          return true;
        } else {
          return false;
        }
      },
      //获取指定时间的前x天x小时x分钟的时间戳
      getDeadtime: function (date, day, hour, min) {
        date.setDate(date.getDate() - day);
        date.setHours(date.getHours() - hour);
        date.setMinutes(date.getMinutes() - min);
        return date;
      }
    };

  })

  //格式化时间字符串
  .filter("formatTimeString", function () {
    return function (input) {
      return new Date(parseInt(input.replace(/\D/igm, "")));
    }
  })

  //格式化中文星期
  .filter("GetTranslateWeek", function () {
    return function (input) {
      switch (input) {
        case "Sunday":
          return "周日";
          break;
        case "Monday":
          return "周一";
          break;
        case "Tuesday":
          return "周二";
          break;
        case "Wednesday":
          return "周三";
          break;
        case "Thursday":
          return "周四";
          break;
        case "Friday":
          return "周五";
          break;
        case "Saturday":
          return "周六";
          break;
        default:
          return "";
          break;
      }
    }
  })

  .filter("toJsonName", function () {
    return function (input) {

      if (input != null) {
        var trafficTools = angular.fromJson(input);
        //console.info(trafficTools);
        if (trafficTools.length < 1)return input;
        return trafficTools[0].name;
      }

      return input;
    }
  })

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: '请选择',
      setLabel: '确定',
      todayLabel: '今天',
      closeLabel: '关闭',
      mondayFirst: false,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      templateType: 'modal',//popup
      from: new Date(),
      showTodayButton: true,
      dateFormat: 'yyyy MMMM dd',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

  .filter("toTrafficToolsIcon", function () {
    return function (input) {
      //return " ion-android-plane ";
      switch (input) {
        case "步行":
          return " ion-android-walk ";
          break;
        case "骑自行车":
          return " ion-android-bicycle ";
          break;
        case "汽车":
          return " ion-android-car ";
          break;
        case "大巴":
          return " ion-android-bus ";
          break;
        case "地铁":
          return " ion-android-subway ";
          break;
        case "火车":
          return " ion-android-train ";
          break;
        case "轮渡":
          return " ion-android-boat ";
          break;
        case "飞机":
          return " ion-android-plane ";
          break;
        default:
          return "-";
          break;
      }
    }
  })

  .filter("toProductType", function () {
    return function (input) {
      //return " ion-android-plane ";
      switch (input) {
        case "线路":
          return "line";
          break;
        case "酒店":
          return "hotel";
          break;
        case "门票":
          return "ticket";
          break;
        default:
          return "-";
          break;
      }
    }
  })

  .directive("numbuttonComponent", function () {
    return {
      restrict: 'EA',
      template: "<div class='numbuttonComponent'><input type='button' value='－' on-tap='numbuttonlow()'/>" +
      "<input type='number' ng-model='item.nnum' min='1' ng-keyup='numbuttonblur()' />" +
      "<input type='button' value='＋' on-tap='numbuttonadd()'/></div>",
      controller: function ($scope) {
        $scope.numbuttonadd = function () {
          $scope.item.nnum++;
          $scope.totalComputing();
        };
        $scope.numbuttonlow = function () {
          if ($scope.item.nnum >= 1) {
            $scope.item.nnum--;
            $scope.totalComputing();
          } else {
            $scope.item.nnum = 0;
            $scope.totalComputing();
          }
        };
        $scope.numbuttonblur = function () {
          $scope.totalComputing();
        }
      }
    }
  })

  .factory("Utils", function () {
    return {
      //判断是否为空对象
      isEmptyObject: function (e) {
        var t;
        for (t in e)
          return !1;
        return !0
      },
      trim: function (e) {
        return e.replace(/(^\s*)|(\s*$)/g, "");
      },
      ltrim: function (e) {
        return e.replace(/(^\s*)/g, "");
      },
      rtrim: function (e) {
        return e.replace(/(\s*$)/g, "");
      }
    }
  })

  //隐藏tabs
  .directive('hideTabs', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function () {
          scope.$watch(attributes.hideTabs, function (value) {
            $rootScope.hideTabs = value;
          });
        });

        scope.$on('$ionicView.beforeLeave', function () {
          $rootScope.hideTabs = false;
        });
      }
    };
  })

/*  .filter("toJson", function () {
 return function (input) {
 var tjson = [{path: 'img/t.jpg'}];
 if (input != undefined) {
 var json = angular.fromJson(input);
 if (json.length > 0) {
 console.info(json);
 return json;
 }
 console.info(tjson);
 return tjson;
 }
 console.info(tjson);
 return tjson;
 }
 })*/


;
