angular.module('starter.controllers', ['ionic-datepicker'])


  .controller('TabCtrl', function ($scope, $location, $stateParams, $ionicActionSheet, $http, $ionicHistory) {


      // 点击按钮触发，或一些其他的触发条件
      $scope.showActionSheet = function () {

          // 显示操作表
          $ionicActionSheet.show({
              buttons: [
                { text: '<div class="actionSheet "><img class="actionSheetuut" src="img/ui/uut.png"><span>返回优聚</span></div>' },
                { text: '<div class="actionSheet "><img class="actionSheetyx" src="img/ui/yx.png"><span>返回优信</span></div>' },
                { text: '<div class="actionSheet "><img class="actionSheetme" src="img/ui/me.png"><span>我</span></div>' }
              ],
              buttonClicked: function (index) {
                  $http.get("/api/Account/getUrl").then(function (response) {
                      console.log(response.data);
                      window.location.href = response.data[index];
                  });
                  return true;
              }
          });

      };


  })


  .controller('HomeCtrl', function ($scope, $ionicActionSheet, $http, $ionicLoading) {

      function main(scope, load, http) {
          var that = this;
          this.showLoad = function () {
              load.show();
          };
          this.hideLoad = function () {
              load.hide();
          };
          this.getTypeUrl = '/api/ProductLite/GetProductTypes';
          this.getTypes = function () {
              that.showLoad();
              http.post(that.getTypeUrl).then(function success(items) {
                  scope.ProductTypes = items.data.Root.ChildrenDicEntities;
                  that.hideLoad();
              });
          };
          this.getBackUrl = "/api/Account/LoginUrl";
          this.getBack = function () {
              http.post(that.getBackUrl).then(function (response) {
                  scope.backUrl = response.data;
              });
          };
      }

      var go = new main($scope, $ionicLoading, $http);
      go.getTypes();
      // go.getBack();

  })

  .controller('ProductListCtrl', function ($scope, $location, $stateParams, $http, $filter, $ionicModal, $ionicLoading, $ionicScrollDelegate) {

      $scope.currentAgencyId = $stateParams.agencyId;

      //商品列表
      $scope.productList = {
          Items: []
      };
      //查询参数json
      $scope.parameter_try = {};
      //是否继续滚动加载
      $scope.isLoad = true;
      $scope.loadText = "加载中...";

      $scope.parameter = {
          ProductTypes: [$stateParams.typeName],
          PageIndex: 1,
          PageSize: 10,
          AgencyId: 0
      };

      if ($stateParams.agencyId != undefined) {
          $scope.parameter.SupplierIds = [$stateParams.agencyId];
      }

      $scope.barbtnclass = {
          AllProduct: "btnactive",
          IsRefProduct: "",
          IsHotProduct: ""
      };

      var strUrl = '/api/ProductLite/Get' + $stateParams.typeName + 'Paged';

      (function () {
          if ($stateParams.condition == 'all') {
              $scope.barbtnclass = {
                  AllProduct: "btnactive",
                  IsRefProduct: "",
                  IsHotProduct: ""
              };
          } else if ($stateParams.condition == 'hot') {
              $scope.barbtnclass = {
                  AllProduct: "",
                  IsRefProduct: "",
                  IsHotProduct: "btnactive"
              };
              $scope.parameter.IsHot = true;
          } else if ($stateParams.condition == 'ref') {
              $scope.barbtnclass = {
                  AllProduct: "",
                  IsRefProduct: "btnactive",
                  IsHotProduct: ""
              };
              $scope.parameter.IsSale = true;
          }

          //获取商品子类型
          $http.post('/api/ProductLite/GetProductTypesByKey?Key=' + $stateParams.typeName).success(function (data) {
              //console.info(data);
              $scope.TypeChildren = data;
          });
          //获取供应商分组
          $http.get('/api/Agency/GetAllSupplierGroup').then(function (response) {
              $scope.supplierGroup = response.data.SupplierTypeList;
              //console.log($scope.supplierGroup);
          });
          $ionicModal.fromTemplateUrl('modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
              $scope.modal = modal;
          });
      })();

      $scope.methods = {
          //所有
          allProduct: function () {
              $scope.barbtnclass = {
                  AllProduct: "btnactive",
                  IsRefProduct: "",
                  IsHotProduct: ""
              };
              delete $scope.parameter.IsSale;
              delete $scope.parameter.IsHot;
              $scope.parameter.PageIndex = 1;

              this.loadMoreData(function () {
                  $ionicLoading.show();
                  $scope.productList.Items = [];
                  $scope.loadText = "加载中...";
              }, function () {
                  $ionicLoading.hide();
              })
          },
          //限时甩卖
          isRefProduct: function () {
              $scope.barbtnclass = {
                  AllProduct: "",
                  IsRefProduct: "btnactive",
                  IsHotProduct: ""
              };
              $scope.parameter.IsSale = true;
              delete $scope.parameter.IsHot;
              $scope.parameter.PageIndex = 1;

              this.loadMoreData(function () {
                  $ionicLoading.show();
                  $scope.productList.Items = [];
                  $scope.loadText = "加载中...";
              }, function () {
                  $ionicLoading.hide();
              })

          },
          //热门推荐
          isHotProduct: function () {
              $scope.barbtnclass = {
                  AllProduct: "",
                  IsRefProduct: "",
                  IsHotProduct: "btnactive"
              };
              $scope.parameter.IsHot = true;
              delete $scope.parameter.IsSale;
              $scope.parameter.PageIndex = 1;

              this.loadMoreData(function () {
                  $ionicLoading.show();
                  $scope.productList.Items = [];
                  $scope.loadText = "加载中...";
              }, function () {
                  $ionicLoading.hide();
              })
          },
          //侧边菜单复杂查询
          leftMenusearchBtn: function () {

              if ($scope.parameter_try.SupplierGroupIds != undefined) {
                  $scope.parameter.SupplierGroupIds = [$scope.parameter_try.SupplierGroupIds];
              }
              $scope.parameter.PageIndex = 1;
              //商品分类
              if ($scope.parameter_try.ProductSubTypes == "所有分类" || $scope.parameter_try.ProductSubTypes == undefined) {
                  delete $scope.parameter.ProductSubTypes;
              } else {
                  $scope.parameter.ProductSubTypes = [$scope.parameter_try.ProductSubTypes];
              }
              //日期区间
              if ($scope.parameter_try.StartDate == undefined || $scope.parameter_try.EndDate == undefined) {
                  delete $scope.parameter.StartDate;
                  delete $scope.parameter.EndDate;
              }
              else {
                  $scope.parameter.StartDate = $filter("date")($scope.parameter_try.StartDate);
                  $scope.parameter.EndDate = $filter("date")($scope.parameter_try.EndDate);
              }
              //价格区间
              if ($scope.parameter.MaxPrice == undefined || $scope.parameter.MinPrice == undefined) {
                  delete $scope.parameter.MaxPrice;
                  delete $scope.parameter.MinPrice;
              }
              $scope.modal.hide();

              this.loadMoreData(function () {
                  $ionicLoading.show();
                  $scope.productList.Items = [];
                  $scope.loadText = "加载中...";
              }, function () {
                  $ionicLoading.hide();
              })

          },
          //侧边菜单重置查询条件
          leftMenuresetBtn: function () {
              //console.log('start', $scope.parameter);
              delete $scope.parameter_try.ProductSubTypes;
              delete $scope.parameter.ProductSubTypes;
              delete $scope.parameter.StartDate;
              delete $scope.parameter.EndDate;
              delete $scope.parameter_try.StartDate;
              delete $scope.parameter_try.EndDate;
              delete $scope.parameter.MaxPrice;
              delete $scope.parameter.MinPrice;
              delete $scope.parameter.SupplierGroupIds;
              $scope.parameter_try.SupplierGroupIds = undefined;
              //console.log('end', $scope.parameter);
          },
          //关键字查询
          searchBtn: function () {
              $scope.parameter.PageIndex = 1;
              this.loadMoreData(function () {
                  $ionicLoading.show();
                  $scope.productList.Items = [];
                  $scope.loadText = "加载中...";
              }, function () {
                  $ionicLoading.hide();
              })
          },
          //滚动加载
          loadMoreData: function (init, callBack) {
              if (typeof init === 'function') {
                  init();
              }

              $http.post(strUrl, $scope.parameter).then(function (response) {

                  if ($scope.productList.Items.length > 0) {
                      $scope.productList.Items = $scope.productList.Items.concat(response.data.Items);
                  } else {
                      $scope.productList = response.data;
                  }

                  if (response.data.Items.length < $scope.parameter.PageSize) {
                      $scope.loadText = "没有更多数据了";
                      $scope.isLoad = false;
                  } else {
                      $scope.isLoad = true;
                  }

                  if (typeof callBack === 'function') {
                      callBack();
                  }

                  $scope.parameter.PageIndex++;
                  $scope.$broadcast("scroll.infiniteScrollComplete");

              });

          }
      };

      $scope.methods.loadMoreData(function () {
          $ionicLoading.show();
      }, function () {
          $ionicLoading.hide();
      });

  })

  .controller('MapCtrl', function ($scope, $location, $stateParams) {
      //$scope.address = "113.273148,23.131942";

      var latitude = $stateParams.latitude != "" ? $stateParams.latitude : "23.1353090000";
      var longitude = $stateParams.longitude != "" ? $stateParams.longitude : "113.2707930000";

      /*百度地图API功能*/
      var map = new BMap.Map("allmap");
      map.centerAndZoom(new BMap.Point(longitude, latitude), 19);
      map.enableScrollWheelZoom(true);

      var lo = $location.search().longitude;
      var la = $location.search().latitude;

      //console.info(lo);
      //console.info(la);

      if (lo != undefined && la != undefined && lo != "" && la != "") {
          longitude = lo;
          latitude = la;
      }

      /*用经纬度设置地图中心点*/
      map.clearOverlays();
      var new_point = new BMap.Point(longitude, latitude);

      /*创建标注*/
      var marker = new BMap.Marker(new_point);

      /*将标注添加到地图中*/
      map.addOverlay(marker);
      map.panTo(new_point);

  })

  .controller('LineDetailCtrl', function ($scope, $stateParams, $http, $ionicModal, ionicDatePicker, $ionicLoading, Utils, $ionicSlideBoxDelegate, DateHelper, $ionicScrollDelegate) {

      $ionicModal.fromTemplateUrl('ordermodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.ordermodal = modal;
      });
      $scope.openorderModal = function () {
          $scope.ordermodal.show();
      };
      $scope.closeorderModal = function () {
          $scope.ordermodal.hide();
          $scope.ordermodal.hide();
      };
      $ionicModal.fromTemplateUrl('tripmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.tripmodal = modal;
      });

      $scope.currentAgencyId = $stateParams.agencyId;

      $scope.productDetail = {};
      $scope.slideBoxImgs = {};
      $ionicLoading.show();
      $http.post('/api/Product/GetLineDetail?productId=' + $stateParams.productID).success(function (data) {

          $scope.productDetail = data;
          $scope.slideBoxImgs = angular.fromJson($scope.productDetail.LineMainDto.Media.ImageInfos);
          //console.log($scope.slideBoxImgs);
          if ($scope.slideBoxImgs.length < 1) {
              $scope.slideBoxImgs = [{ path: "img/ui/defaultslideimg.png" }];
          }

          angular.forEach($scope.productDetail.DayTripDto, function (daytrip) {
              daytrip.show = false;
              if (daytrip.Items != null) {
                  if (daytrip.Items.length > 0) {
                      angular.forEach(daytrip.Items, function (d) {
                          d.ImageInfos = angular.fromJson(d.ImageInfos);
                      })
                  }
              }


              daytrip.destinationList = [];
              if (daytrip.Arrivals != "" && daytrip.TrafficWays != "" && daytrip.Arrivals != null && daytrip.TrafficWays != null) {
                  var arrivals = angular.fromJson(daytrip.Arrivals);
                  var trafficWays = angular.fromJson(daytrip.TrafficWays);

                  if (arrivals != null && trafficWays != null) {
                      if (trafficWays.length > 0 && arrivals.length > 0) {
                          for (var i = 0; i < trafficWays.length; i++) {
                              var des = {
                                  way: trafficWays[i].name,
                                  add: arrivals[i] != undefined ? arrivals[i].name : ""
                              };
                              daytrip.destinationList.push(des);
                          }
                      }
                  }


              }


          });

          //console.log($scope.productDetail.AppointtimeDtos);

          var selectDatePricing = {
              callback: function (val) {
                  var selectData = new Date(val);
                  var ndate = new Date();

                  $scope.LineQuoteDtos = {};
                  angular.forEach($scope.productDetail.AppointtimeDtos, function (apponinttime) {

                      ndate = new Date(parseInt(apponinttime.UseTime.replace(/\D/igm, "")));

                      if (selectData - ndate == 0) {

                          if (Utils.isEmptyObject(apponinttime.QuoteDtos) == false || apponinttime.LineAdditionalItemDtos.length > 0) {
                              $scope.LineQuoteDtos = apponinttime;
                              //console.info($scope.LineQuoteDtos);
                              angular.forEach($scope.LineQuoteDtos.QuoteDtos, function (d) {
                                  d.nnum = 1;
                              });
                              angular.forEach($scope.LineQuoteDtos.LineAdditionalItemDtos, function (d) {
                                  d.nnum = 1;
                              });
                              $scope.totalComputing();
                              $scope.ordermodal.show();
                          }
                      }

                  });

                  if (Utils.isEmptyObject($scope.LineQuoteDtos)) {
                      //console.info("尚无报价");
                      $ionicLoading.show({ template: '尚无报价', duration: 500 });
                  }


              },
              to: new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate()),
              pricing: $scope.productDetail.AppointtimeDtos
          };
          $scope.openDatePicker = function () {
              ionicDatePicker.openDatePicker(selectDatePricing);
          };

          $ionicLoading.hide();

          $ionicSlideBoxDelegate.loop(true); //解决轮播至最后一个不轮播的问题
          $ionicSlideBoxDelegate.update(); //解决图片加载不出来的问题
      });

      /*    //当我们用到模型时，清除它！
       $scope.$on('$destroy', function () {
       $scope.tripmodal.remove();
       });
       //当我们用到模型时，清除它！
       $scope.$on('$destroy', function () {
       $scope.ordermodal.remove();
       });
  
       // 当隐藏的模型时执行动作
       $scope.$on('tripmodal.hide', function () {
       // 执行动作
       });
       // 当移动模型时执行动作
       $scope.$on('tripmodal.removed', function () {
       // 执行动作
       });*/

      $scope.visitor = {
          name: "",
          phone: ""
      };

      //计算总金额
      $scope.totalComputing = function () {
          $scope.totalAmount = 0;
          angular.forEach($scope.LineQuoteDtos.QuoteDtos, function (p) {
              $scope.totalAmount += p.QuoteItemsDtos[0].SalePrice * p.nnum;
          });
          angular.forEach($scope.LineQuoteDtos.LineAdditionalItemDtos, function (p) {
              $scope.totalAmount += p.additionalPrice * p.nnum;
          });
      };
      //提交订单
      $scope.submitOrders = function () {
          // console.log($scope.productDetail);
          // console.info($scope.LineQuoteDtos);

          var quoteDate = DateHelper.FormatTimeString($scope.LineQuoteDtos.UseTime);
          var deadDate = DateHelper.getDeadtime(
            quoteDate,
            $scope.productDetail.LineMainDto.DeadlineDay,
            $scope.productDetail.LineMainDto.DeadlineHour,
            $scope.productDetail.LineMainDto.DeadlineMinutes);
          if ((new Date()).getTime() > deadDate.getTime()) {
              $ionicLoading.show({
                  template: '超过截止预订时间<br>:' + $scope.productDetail.LineMainDto.DeadlineDay + '天' + $scope.productDetail.LineMainDto.DeadlineHour + '时' + $scope.productDetail.LineMainDto.DeadlineMinutes + '分',
                  duration: 2000
              });
              return;
          }
          // console.log(deadDate.toLocaleString());


          var input = {
              PeerMallOrderInfoInput: {
                  OrderType: 0,
                  OccupiedType: 1,
                  BuyerAgencyId: 0,
                  BuyerAgencyName: ".",
                  BuyerUserId: 0,
                  BuyerUserName: ".",
              },
              OrderProductListInput: [{
                  ProductId: $scope.productDetail.LineMainDto.LineGuid,
                  ProductName: $scope.productDetail.LineMainDto.ProductLineName,
                  OrderProductDateListInput: [{
                      DateId: $scope.LineQuoteDtos.AppointTimeGuid,
                      OrderProductDateQuoteListInput: []
                  }]
              }],
              OrderVisitorListInput: [
                {
                    VisitorName: $scope.visitor.name,
                    VisitorPhone: $scope.visitor.phone
                }
              ]
          };

          for (var i = 0; i < $scope.LineQuoteDtos.QuoteDtos.length; i++) {
              if ($scope.LineQuoteDtos.QuoteDtos[i].nnum > 0) {
                  var quote = {
                      QuoteId: $scope.LineQuoteDtos.QuoteDtos[i].QuoteItemsDtos[0].Id,
                      PriceType: "Quote",
                      Quantity: $scope.LineQuoteDtos.QuoteDtos[i].nnum
                  };
                  input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
              }
          }

          for (var i = 0; i < $scope.LineQuoteDtos.LineAdditionalItemDtos.length; i++) {
              if ($scope.LineQuoteDtos.LineAdditionalItemDtos[i].nnum > 0) {
                  var quote = {
                      QuoteId: $scope.LineQuoteDtos.LineAdditionalItemDtos[i].AdditionalGuid,
                      PriceType: "Additional",
                      Quantity: $scope.LineQuoteDtos.LineAdditionalItemDtos[i].nnum
                  };
                  input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
              }
          }

          // console.log(input);

          if (input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.length < 1) {
              $ionicLoading.show({ template: '请输入购买数量', duration: 500 });
              return;
          }
          if (Utils.trim($scope.visitor.name) == "") {
              $ionicLoading.show({ template: '请输入游客姓名', duration: 500 });
              return;
          }

          $ionicLoading.show();
          $http.post("/api/Order/SubmitOrder", input).then(function (response) {
              $ionicLoading.show({ template: '订单已成功提交', duration: 1000 });
              $scope.ordermodal.hide();
              // console.log(response.data);
          }, function () {
              $ionicLoading.show({ template: '尚未与卖家建立关系，不可下单', duration: 1000 });
          });

      };

      $scope.methods = {
          dayTripItemToggle: function (id) {
              for (var i = 0; i < $scope.productDetail.DayTripDto.length; i++) {
                  if ($scope.productDetail.DayTripDto[i].Id == id) {
                      $scope.productDetail.DayTripDto[i].show = !$scope.productDetail.DayTripDto[i].show;
                      $ionicScrollDelegate.resize();
                  }
              }
          },
          consultingBtn: function () {
              var input = {
                  type: escape($scope.productDetail.ProductType),
                  id: $scope.productDetail.LineId,
                  url: window.location.href
              };
              var prm = escape(JSON.stringify(input));
              if ($scope.currentAgencyId == undefined) {
                  window.location.href = "#/tab/consulting?prm=" + prm;
              } else {
                  window.location.href = "#/tab/consulting/" + $scope.currentAgencyId + "?prm=" + prm;
              }
          },
          referenceBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          },
          copyBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          }
      };

  })

  .controller('HotelDetailCtrl', function ($scope, $stateParams, $http, $ionicSlideBoxDelegate, $ionicLoading, ionicDatePicker, $ionicModal, DateHelper, Utils) {

      $ionicModal.fromTemplateUrl('ordermodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.tripmodal = modal;
      });

      $scope.data = {
          currentAgencyId: $stateParams.agencyId,
          startDate: new Date(),
          endDate: DateHelper.GetDateHelp((new Date()).getTime(), 1),
          dateDiff: DateHelper.GetDateDiff((new Date()), DateHelper.GetDateHelp((new Date()).getTime(), 1)),
          specifiedPeriodHotelInfo: [],
          endQuotelist: [],
          visitor: {
              name: "",
              phone: ""
          }
      };

      var dataPricing = {
          startDatePricing: {
              to: new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate())
          },
          endDatePricing: {
              showTodayButton: false,
              to: new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate())
          }
      };
      var methods = {
          //获取指定时间内酒店票务信息
          GetHotelInfoinSpecifiedPeriod: function (AppointtimeDtos, startDate, endDate) {
              var specifiedPeriodHotelInfo = [];
              angular.forEach(AppointtimeDtos, function (hotelInfo) {
                  var currentDate = DateHelper.FormatTimeString(hotelInfo.UseTime);
                  if (DateHelper.IsDateInSpecifiedPeriod(currentDate, startDate, endDate)) {
                      specifiedPeriodHotelInfo.push(hotelInfo);
                  }
              });
              $scope.data.specifiedPeriodHotelInfo = specifiedPeriodHotelInfo;
              this.getQuoteOnly(specifiedPeriodHotelInfo);
          },
          getQuoteOnly: function (quoteList) {
              var quoteNameList = [];
              var quoteSpList = [];
              var endQuotelist = [];

              angular.forEach(quoteList, function (date) {
                  angular.forEach(date.QuoteDtos, function (quote) {
                      //console.log(quote);
                      if (quoteNameList.indexOf(quote.QuoteName) == -1) {
                          quoteNameList.push(quote.QuoteName);
                      }

                      var q = {
                          name: quote.QuoteName,
                          price: quote.QuoteItemsDtos[0] ? quote.QuoteItemsDtos[0].SalePrice : ''
                      };

                      //余量处理
                      if (quote.IsMore) {
                          if (q.price) quoteSpList.push(q);
                      } else {
                          if ((quote.QuoteCount - quote.SoldNumber) > 0) {
                              if (q.price) quoteSpList.push(q);
                          }
                      }


                  });
              });

              var quoteGroup = [];
              angular.forEach(quoteNameList, function (name) {
                  var qq = quoteSpList.filter(function (q) {
                      return q.name == name;
                  });
                  if (qq.length > 0)
                      quoteGroup.push(qq);
              });

              angular.forEach(quoteGroup, function (ql) {
                  //console.log(ql);
                  var sp = {
                      name: ql[0].name,
                      price: 0,
                      state: ql.length != $scope.data.dateDiff ? "满房" : "",
                      nnum: ql.length != $scope.data.dateDiff ? 0 : 1
                  };
                  var priceTotal = 0;
                  angular.forEach(ql, function (q) {
                      priceTotal += q.price;
                  });
                  sp.price = priceTotal / ql.length;
                  endQuotelist.push(sp);
              });
              $scope.data.endQuotelist = endQuotelist;
              // console.log($scope.data.endQuotelist);
              $scope.totalComputing();
          },
          init: function () {
              $ionicLoading.show();
              $http.post('/api/Product/GetHotelDetail?productId=' + $stateParams.productID).success(function (data) {
                  $scope.hotel = data;

                  if ($scope.hotel.Media.ImageInfoList.length < 1) {
                      $scope.hotel.Media.ImageInfoList = [{ path: "img/ui/defaultslideimg.png" }];
                  }

                  $scope.HotelFacilities = (data.HotelFacilities).split(',');

                  methods.GetHotelInfoinSpecifiedPeriod(data.AppointtimeDtos, $scope.data.startDate, $scope.data.endDate);

                  dataPricing.startDatePricing.callback = function (val) {
                      $scope.data.startDate = new Date(val);
                      if ($scope.data.startDate.getTime() >= $scope.data.endDate.getTime()) {
                          $scope.data.endDate = DateHelper.GetDateHelp($scope.data.startDate, 1);
                      }
                      $scope.data.dateDiff = DateHelper.GetDateDiff($scope.data.startDate, $scope.data.endDate);
                      methods.GetHotelInfoinSpecifiedPeriod(data.AppointtimeDtos, $scope.data.startDate, $scope.data.endDate);
                  };
                  dataPricing.startDatePricing.pricing = $scope.hotel.AppointtimeDtos;
                  $scope.startDatePicker = function () {
                      ionicDatePicker.openDatePicker(dataPricing.startDatePricing);
                  };

                  dataPricing.endDatePricing.callback = function (val) {
                      if ((new Date(val).getTime() <= $scope.data.startDate.getTime()))
                          return $ionicLoading.show({ template: '请至少选择入住一晚！', duration: 1500 });
                      $scope.data.endDate = new Date(val);
                      $scope.data.dateDiff = DateHelper.GetDateDiff($scope.data.startDate, $scope.data.endDate);
                      methods.GetHotelInfoinSpecifiedPeriod(data.AppointtimeDtos, $scope.data.startDate, $scope.data.endDate);
                  };
                  dataPricing.endDatePricing.pricing = $scope.hotel.AppointtimeDtos;
                  $scope.endDatePicker = function () {
                      ionicDatePicker.openDatePicker(dataPricing.endDatePricing);
                  };


                  $ionicSlideBoxDelegate.loop(true); //解决轮播至最后一个不轮播的问题
                  $ionicSlideBoxDelegate.update(); //解决图片加载不出来的问题

                  $ionicLoading.hide();
              });
          },
          getSameQuoteNnum: function (list, name) {
              var num = -1;
              angular.forEach(list, function (l) {
                  if (l.nnum > 0) {
                      if (name == l.name) {
                          num = l.nnum;
                      }
                  }
              });
              return num;
          }
      };

      $scope.methods = {
          submitOrders: function () {

              if ($scope.data.endQuotelist.length < 1) {
                  $ionicLoading.show({ template: '当前时间段内暂无合适的房型', duration: 1500 });
                  return;
              } else {
                  var totalNum = 0;
                  angular.forEach($scope.data.endQuotelist, function (q) {
                      totalNum += q.nnum;
                  });
                  if (totalNum < 1) {
                      $ionicLoading.show({ template: '输入预订数量', duration: 500 });
                      return;
                  }
              }
              var deadDate = DateHelper.getDeadtime($scope.data.startDate, $scope.hotel.DeadlineDay, $scope.hotel.DeadlineHour, $scope.hotel.DeadlineMinutes);
              if ((new Date()).getTime() > deadDate.getTime()) {
                  $ionicLoading.show({
                      template: '入住时间超过截止预订时间<br>:' + $scope.hotel.DeadlineDay + '天' + $scope.hotel.DeadlineHour + '时' + $scope.hotel.DeadlineMinutes + '分',
                      duration: 2000
                  });
                  return;
              }
              if (Utils.trim($scope.data.visitor.name) == "") {
                  $ionicLoading.show({ template: '请输入游客姓名', duration: 500 });
                  return;
              }

              var input = {
                  PeerMallOrderInfoInput: {
                      OrderType: 1,
                      OccupiedType: 1,
                      BuyerAgencyId: 0,
                      BuyerAgencyName: ".",
                      BuyerUserId: 0,
                      BuyerUserName: ".",
                  },
                  OrderProductListInput: [{
                      ProductId: $scope.hotel.HotelGuid,
                      //ProductName: $scope.productDetail.LineMainDto.ProductLineName,
                      OrderProductDateListInput: []
                  }],
                  OrderVisitorListInput: [
                    {
                        VisitorName: $scope.data.visitor.name,
                        VisitorPhone: $scope.data.visitor.phone
                    }
                  ]
              };

              angular.forEach($scope.data.specifiedPeriodHotelInfo, function (date) {

                  var dItem = {
                      DateId: date.AppointTimeGuid,
                      OrderProductDateQuoteListInput: []
                  };

                  angular.forEach(date.QuoteDtos, function (quote) {

                      var num = methods.getSameQuoteNnum($scope.data.endQuotelist, quote.QuoteName);
                      if (num != -1) {

                          var qItem = {
                              QuoteId: quote.QuoteItemsDtos[0].Id,
                              PriceType: 0,
                              Quantity: num
                          };
                          dItem.OrderProductDateQuoteListInput.push(qItem);

                      }

                  });

                  if (dItem.OrderProductDateQuoteListInput.length > 0)
                      input.OrderProductListInput[0].OrderProductDateListInput.push(dItem);

              });

              $ionicLoading.show();
              $http.post("/api/Order/SubmitOrder", input).then(function (response) {
                  $ionicLoading.show({ template: '订单已成功提交', duration: 1000 });
                  $scope.tripmodal.hide();
                  // console.log(response.data);
              }, function () {
                  $ionicLoading.show({ template: '尚未与卖家建立关系，不可下单', duration: 1000 });
              });
          },
          consultingBtn: function () {
              var input = {
                  type: escape($scope.hotel.ProductType),
                  id: $scope.hotel.HotelGuid,
                  url: window.location.href
              };
              var prm = escape(JSON.stringify(input));
              if ($scope.data.currentAgencyId == undefined) {
                  window.location.href = "#/tab/consulting?prm=" + prm;
              } else {
                  window.location.href = "#/tab/consulting/" + $scope.data.currentAgencyId + "?prm=" + prm;
              }
          },
          referenceBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          },
          copyBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          }
      };

      $scope.totalComputing = function () {
          $scope.totalAmount = 0;
          angular.forEach($scope.data.endQuotelist, function (q) {
              $scope.totalAmount += (q.price * q.nnum * $scope.data.dateDiff);
          });
      };

      methods.init();

  })

  .controller('TicketDetailCtrl', function ($scope, $http, $stateParams, $ionicSlideBoxDelegate, ionicDatePicker, $ionicLoading, Utils, DateHelper, $ionicModal) {

      $scope.currentAgencyId = $stateParams.agencyId;

      $ionicModal.fromTemplateUrl('ordermodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.ordermodal = modal;
      });
      $scope.openorderModal = function () {
          $scope.ordermodal.show();
      };
      $scope.closeorderModal = function () {
          $scope.ordermodal.hide();
      };

      $ionicLoading.show();
      $http.post('/api/Product/GetTicketDetail?productId=' + $stateParams.productID).success(function (data) {
          $scope.ticket = data;

          if ($scope.ticket.Media.ImageInfoList.length < 1) {
              $scope.ticket.Media.ImageInfoList = [{ path: "img/ui/defaultslideimg.png" }];
          }

          var startDatePricing = {
              callback: function (val) {
                  var selectDate = new Date(val);
                  //console.info(selectDate);

                  var ndate = new Date();

                  $scope.LineQuoteDtos = {};
                  angular.forEach($scope.ticket.AppointtimeDtos, function (apponinttime) {
                      ndate = DateHelper.FormatTimeString(apponinttime.UseTime);
                      //console.info(ndate);
                      if (selectDate - ndate == 0) {
                          if (Utils.isEmptyObject(apponinttime.QuoteDtos) == false) {
                              $scope.LineQuoteDtos = apponinttime;
                              //console.info($scope.LineQuoteDtos);
                              angular.forEach($scope.LineQuoteDtos.QuoteDtos, function (d) {
                                  d.nnum = 1;
                              });
                              $scope.totalComputing();
                              $scope.ordermodal.show();
                          }
                      }
                  });

                  if (Utils.isEmptyObject($scope.LineQuoteDtos.QuoteDtos)) {
                      //console.info("尚无报价");
                      $ionicLoading.show({ template: '尚无报价', duration: 500 });
                  }

              },
              //from: new Date(2016, 0, 01),
              to: new Date((new Date()).getFullYear() + 1, (new Date()).getMonth(), (new Date()).getDate()),
              pricing: data.AppointtimeDtos
          };
          $scope.startDatePicker = function () {
              ionicDatePicker.openDatePicker(startDatePricing);
          };

          $ionicSlideBoxDelegate.loop(true); //解决轮播至最后一个不轮播的问题
          $ionicSlideBoxDelegate.update(); //解决图片加载不出来的问题

          $ionicLoading.hide();
      });

      $scope.visitor = {
          name: "",
          phone: ""
      };
      $scope.totalComputing = function () {
          $scope.totalAmount = 0;
          angular.forEach($scope.LineQuoteDtos.QuoteDtos, function (p) {
              $scope.totalAmount += p.QuoteItemsDtos[0].SalePrice * p.nnum;
          })
      };
      $scope.submitOrders = function () {
          // console.info($scope.LineQuoteDtos);

          var quoteDate = DateHelper.FormatTimeString($scope.LineQuoteDtos.UseTime);
          var deadDate = DateHelper.getDeadtime(
            quoteDate,
            $scope.ticket.DeadlineDay,
            $scope.ticket.DeadlineHour,
            $scope.ticket.DeadlineMinutes);
          if ((new Date()).getTime() > deadDate.getTime()) {
              $ionicLoading.show({
                  template: '超过截止预订时间<br>:' + $scope.ticket.DeadlineDay + '天' + $scope.ticket.DeadlineHour + '时' + $scope.ticket.DeadlineMinutes + '分',
                  duration: 2000
              });
              return;
          }

          var input = {
              PeerMallOrderInfoInput: {
                  OrderType: 2,
                  OccupiedType: 1,
                  BuyerAgencyId: 0,
                  BuyerAgencyName: ".",
                  BuyerUserId: 0,
                  BuyerUserName: ".",
              },
              OrderProductListInput: [{
                  ProductId: $scope.LineQuoteDtos.QuoteDtos[0].ProductId,
                  //ProductName: $scope.productDetail.LineMainDto.ProductLineName,
                  OrderProductDateListInput: [{
                      DateId: $scope.LineQuoteDtos.QuoteDtos[0].AppointTimeId,
                      OrderProductDateQuoteListInput: []
                  }]
              }],
              OrderVisitorListInput: [
                {
                    VisitorName: $scope.visitor.name,
                    VisitorPhone: $scope.visitor.phone
                }
              ]
          };

          for (var i = 0; i < $scope.LineQuoteDtos.QuoteDtos.length; i++) {
              if ($scope.LineQuoteDtos.QuoteDtos[i].nnum > 0) {
                  var quote = {
                      QuoteId: $scope.LineQuoteDtos.QuoteDtos[i].QuoteItemsDtos[0].Id,
                      PriceType: "Quote",
                      Quantity: $scope.LineQuoteDtos.QuoteDtos[i].nnum
                  };
                  input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.push(quote);
              }
          }

          if (input.OrderProductListInput[0].OrderProductDateListInput[0].OrderProductDateQuoteListInput.length < 1) {
              $ionicLoading.show({ template: '请输入购买数量', duration: 500 });
              return;
          }
          if (Utils.trim($scope.visitor.name) == "") {
              $ionicLoading.show({ template: '请输入游客姓名', duration: 500 });
              return;
          }

          // console.log(input);


          $ionicLoading.show();
          $http.post("/api/Order/SubmitOrder", input).then(function (response) {
              $ionicLoading.show({ template: '订单已成功提交', duration: 1000 });
              $scope.ordermodal.hide();
              // console.log(response.data);
          }, function () {
              $ionicLoading.show({ template: '尚未与卖家建立关系，不可下单', duration: 1000 });
          });

      };
      $scope.methods = {
          consultingBtn: function () {
              var input = {
                  type: escape($scope.ticket.ProductType),
                  id: $scope.ticket.TicketGuid,
                  url: window.location.href
              };
              var prm = escape(JSON.stringify(input));
              if ($scope.currentAgencyId == undefined) {
                  window.location.href = "#/tab/consulting?prm=" + prm;
              } else {
                  window.location.href = "#/tab/consulting/" + $scope.currentAgencyId + "?prm=" + prm;
              }
          },
          referenceBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          },
          copyBtn: function () {
              $ionicLoading.show({ template: '敬请期待', duration: 500 });
          }
      };
  })

  .controller('ConsultingCtrl', function ($scope, $http, $ionicLoading) {

      (function (http, load) {
          var url = window.location.href;
          var param = (url.split('='))[1];
          if (param == undefined) return;
          var input = JSON.parse(unescape(param));
          input.type = unescape(input.type);
          load.show();
          http.post('/api/Consulting/Consulting', input).then(function (response) {
              load.hide();
              document.getElementById('consultingIframe').src = response.data;
          }, function (response) {
              load.show({ template: response.data.ExceptionMessage, duration: 1500 });
          });
      })($http, $ionicLoading);

  })


  .controller('SupplierCtrl', function ($scope, $ionicSideMenuDelegate, $http, $ionicLoading) {

      $scope.data = {
          parameter: {
              GroupId: 0,
              MaxResultCount: 10,
              SkipCount: 0
          },
          isLoad: true
      };
      $scope.methods = {
          toggleLeftSideMenu: function () {
              $ionicSideMenuDelegate.toggleLeft();
          },
          typeSelect: function (id) {
              if (id != $scope.data.parameter.GroupId) {
                  $scope.data.parameter.GroupId = id;
                  //console.log($scope.data.parameter);
                  $scope.data.supplierList = [];
                  $scope.data.parameter.SkipCount = 0;
                  $scope.data.isLoad = true;
              }
              $scope.methods.toggleLeftSideMenu();
          },
          scrollLoad: function () {

              $http.post(mainPrivate.data.getSupplierUrl, $scope.data.parameter).then(function success(response) {
                  //console.log(response.data);
                  if (response.data.SupplierList.length < $scope.data.parameter.MaxResultCount) {
                      $scope.data.isLoad = false;
                  }
                  if ($scope.data.parameter.SkipCount > 0) {
                      $scope.data.supplierList = $scope.data.supplierList.concat(response.data.SupplierList);
                  } else {
                      $scope.data.supplierList = response.data.SupplierList;
                  }
                  $scope.data.parameter.SkipCount += response.data.SupplierList.length;

                  $scope.$broadcast("scroll.infiniteScrollComplete");
              });

          }
      };
      var mainPrivate = {
          data: {
              getGroupListUrl: "/api/Agency/GetAllSupplierGroup",
              getSupplierUrl: "/api/Agency/GetMySupplierList"
          },
          methods: {
              getGroupList: function () {
                  // $ionicLoading.show();
                  $http.get(mainPrivate.data.getGroupListUrl).then(function success(response) {
                      //console.log(data);
                      $scope.data.supplierType = response.data.SupplierTypeList;
                      // $scope.data.supplierList = response.data.SupperlierList.SupplierList;
                      // $ionicLoading.hide();
                  });
              },
              getSupplier: function (callBack) {
                  // $ionicLoading.show();
                  $http.post(mainPrivate.data.getSupplierUrl, $scope.data.parameter).then(function success(response) {
                      callBack();
                      //console.log(data);
                      // $scope.data.supplierList = response.data.SupplierList;
                      // $ionicLoading.hide();
                  });
              }
          }
      };

      mainPrivate.methods.getGroupList();

      $scope.$on('stateChangeSuccess', function () {
          $scope.methods.scrollLoad();
      });

  })

  .controller('SupplierHomeCtrl', function ($scope, $ionicModal, $stateParams, $http, $ionicLoading) {

      $ionicModal.fromTemplateUrl('modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.modal = modal;
      });

      $scope.data = {
          agencyInfo: {},
          currentAgencyId: $stateParams.agencyId
      };

      var main = {
          data: {
              getAgencyInfoUrl: "/api/Agency/GetAgencyDetailInfoByAgencyId/" + $stateParams.agencyId,
              getProductType: "/api/ProductLite/GetProductTypes",
              getNoticeUrl: "/api/Notice/GetList",
              getNOticeDetail: "/api/Notice/GetDetail/"
          },
          methods: {
              getAgencyInfo: function (callBack) {
                  $http.get(main.data.getAgencyInfoUrl).then(function success(response) {
                      //console.log(response.data);
                      $scope.data.agencyInfo = response.data;
                      callBack();
                  }, function () {
                      $ionicLoading.show({ template: '找不到供应商', duration: 500 });
                      history.back();
                  });
              },
              getProductType: function (callBack) {
                  $http.post(main.data.getProductType).then(function success(items) {
                      $scope.ProductTypes = items.data.Root.ChildrenDicEntities;
                      callBack();
                  });
              },
              getNoticeList: function (callBack) {
                  $http.post(main.data.getNoticeUrl, {
                      PageIndex: 1,
                      PageSize: 1,
                      AgencyId: $stateParams.agencyId
                  }).then(function (response) {
                      if (response.data.Data.length > 0) {

                          $http.get(main.data.getNOticeDetail + response.data.Data[0].APGuid).then(function (response) {
                              $scope.notice = response.data;
                              // $scope.notice.fullContent = $scope.notice.Title + ":" + $scope.notice.Content;
                          });

                      }
                      callBack();
                  });
              }
          }
      };

      $ionicLoading.show();
      main.methods.getAgencyInfo(function () {
          main.methods.getProductType(function () {
              main.methods.getNoticeList(function () {
                  $ionicLoading.hide();
              });
          });
      });
  })

  .controller('NoticeCtrl', function ($scope, $http, $stateParams, $ionicLoading, $ionicScrollDelegate) {

      if ($stateParams.Id == undefined) return;
      var data = {
          url: "/api/Notice/GetList"
      };
      $scope.data = {
          parameter: {
              Title: "",
              PageIndex: 1,
              PageSize: 10,
              AgencyId: $stateParams.Id
          },
          isLoad: true,
          loadText: "加载中...",
          noticeList: ""
      };
      $scope.methods = {
          scrollLoad: function (init, callBack) {
              if (typeof init == 'function') {
                  init();
              }
              $http.post(data.url, $scope.data.parameter).then(function (response) {
                  //console.log(response.data);
                  if (response.data.Data.length < 1 || response.data.Data.length < $scope.data.parameter.PageSize) {
                      $scope.data.isLoad = false;
                      $scope.data.loadText = "没有更多数据了";
                  } else {
                      $scope.data.isLoad = true;
                  }
                  if ($scope.data.noticeList == "") {
                      $scope.data.noticeList = response.data;
                  } else {
                      $scope.data.noticeList.Data = $scope.data.noticeList.Data.concat(response.data.Data);
                  }
                  $scope.data.parameter.PageIndex++;
                  $scope.$broadcast("scroll.infiniteScrollComplete");
                  if (typeof callBack == 'function') {
                      callBack();
                  }
              });
          },
          selectBtn: function () {
              $scope.data.parameter.PageIndex = 1;
              $scope.data.noticeList = "";
              // $scope.data.isLoad = true;
              $scope.data.noticeList.Data = [];
              this.scrollLoad(function () {
                  $scope.data.loadText = "加载中...";
                  $ionicLoading.show();
              }, function () {
                  $ionicLoading.hide();
              })
          }
      };


      (function () {
          $scope.methods.scrollLoad(function () {
              $ionicLoading.show();
          }, function () {
              $ionicLoading.hide();
          });
      })();


  })

  .controller('NoticeDetailCtrl', function ($scope, $http, $stateParams, $ionicLoading) {

      function main(scope, http, id, load) {
          var that = this;
          this.url = "/api/Notice/GetDetail/";
          this.getDetail = function () {
              load.show();
              http.get(that.url + id).then(function (response) {
                  //console.log(response.data);
                  scope.notice = response.data;
                  load.hide();
              });
          }
      }

      var go = new main($scope, $http, $stateParams.Id, $ionicLoading);
      go.getDetail();

  })


  .controller('SupplieryellowpageCtrl', function ($scope, $stateParams, $ionicModal, $http, $ionicLoading, $ionicScrollDelegate) {

      $ionicModal.fromTemplateUrl('modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.modal = modal;
      });

      var main = {
          data: {
              initUrl: "/api/Agency/GetBusinessTypes",
              selectSupplierUrl: "/api/Agency/GetSupplierListByCondition",
              buildRelationUrl: "/api/Agency/ApiSendInviteAgencyToSupplier"
          },
          methods: {
              getBssType: function () {
                  // $ionicLoading.show();
                  $http.get(main.data.initUrl).then(function success(response) {
                      $scope.main.data.bssTypeList = response.data;
                      // $ionicLoading.hide();
                  });
              }
          }
      };
      $scope.main = {
          parameter: {
              AgencyId: 0,
              SupplierName: "",
              BusinessArea: "",
              Business: "",
              BusinessType: [],
              AgencyRelationState: 3,
              MaxResultCount: 10,
              SkipCount: 0
          },
          data: {
              supplierList: {},
              bssTypeList: {},
              isLoad: true
          },
          methods: {
              selectSupplier: function () {
                  $scope.main.parameter.SkipCount = 0;
                  $scope.main.data.isLoad = true;
                  $scope.modal.hide();

                  $scope.main.data.supplierList.SupplierList = [];
                  $scope.main.data.supplierList = [];

                  $ionicLoading.show();
                  this.scrollLoad(function () {
                      $ionicLoading.hide();
                  });
              },
              clickReset: function () {
                  $scope.main.data.isLoad = true;
                  $scope.main.parameter.SupplierName = "";
                  $scope.main.parameter.BusinessArea = "";
                  $scope.main.parameter.Business = "";
                  $scope.main.parameter.BusinessType = [];
                  $scope.main.parameter.AgencyRelationState = 3;
                  $scope.main.parameter.SkipCount = 0;
              },
              buildRelation: function (id) {
                  var supplierList = $scope.main.data.supplierList.SupplierList;
                  var currentAgency = supplierList.filter(function (item) {
                      return item.AgencyId == id;
                  })[0];
                  var input = {
                      ContactUser: currentAgency.ContactId,
                      ToAgencyId: id
                  };
                  $ionicLoading.show({ template: "发送请求中..." });
                  $http.post(main.data.buildRelationUrl, input).then(function success(response) {
                      if (response.data) {
                          for (var i = 0; i < $scope.main.data.supplierList.SupplierList.length; i++) {
                              if ($scope.main.data.supplierList.SupplierList[i].AgencyId == id) {
                                  $scope.main.data.supplierList.SupplierList[i].AgencyRelationState = 0;
                              }
                          }
                          $ionicLoading.show({ template: "发送请求成功", duration: 1500 });
                      }
                  }, function error() {
                      $ionicLoading.show({ template: "发送请求失败", duration: 1500 });
                  });
              },
              scrollLoad: function (callBack) {

                  if ($scope.main.parameter.Business != "") {
                      $scope.main.parameter.BusinessType = [$scope.main.parameter.Business];
                  }
                  $http.post(main.data.selectSupplierUrl, $scope.main.parameter).then(function success(response) {


                      if (response.data.SupplierList.length < $scope.main.parameter.MaxResultCount) {
                          $scope.main.data.isLoad = false;
                      }
                      if ($scope.main.parameter.SkipCount < 1) {
                          $scope.main.data.supplierList = response.data;
                      } else {
                          $scope.main.data.supplierList.SupplierList = $scope.main.data.supplierList.SupplierList.concat(response.data.SupplierList);
                      }
                      $scope.main.parameter.SkipCount += response.data.SupplierList.length;

                      $scope.$broadcast("scroll.infiniteScrollComplete");

                      if (typeof callBack === 'function') {
                          callBack();
                      }
                  });

              }
          }
      };

      (function () {
          $ionicLoading.show();
          main.methods.getBssType();
          $scope.main.methods.scrollLoad(function () {
              $ionicLoading.hide();
          });
      })();

  })


  .controller('AccountCtrl', function ($scope, $http) {

      $http.post("/api/User/GetCurrentLoginInfo").success(function (data) {
          $scope.User = data;
      });

  })

;
