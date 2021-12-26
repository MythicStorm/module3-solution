(function () {
    'use strict';
    
    angular.module('MenuCategoriesApp', [])
    .controller('MenuCategoriesController', MenuCategoriesController)
    .service('MenuCategoriesService', MenuCategoriesService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItems);


    function FoundItems() {
        var ddo = {
            templateUrl: 'foundItems.html'
        };

        return ddo;
    }
    
    MenuCategoriesController.$inject = ['MenuCategoriesService'];
    function MenuCategoriesController(MenuCategoriesService) {
      var menu = this;
      menu.searchItem = "";

    
      menu.logMenuItems = function () {
        var promise = MenuCategoriesService.getMenuCategories();
        
        promise.then(function (response) {
            menu.categories = response.data;
            console.log(menu.categories);
          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });
        };

        //var promise = MenuCategoriesService.getMenuForCategory(menu.searchItem);
    
       // promise.then(function (response) {
            //menu.categories = response.data;
        //})
        //.catch(function (error) {
          //console.log(error);
        //})    
    };
    
    
    MenuCategoriesService.$inject = ['$http', 'ApiBasePath'];
    function MenuCategoriesService($http, ApiBasePath) {
      var service = this;
    
      service.getMenuCategories = function () {
        var response = $http({
          method: "GET",
          url: (ApiBasePath + "/categories.json")
        });
    
        return response;
      };
    
    
      service.getMenuForCategory = function (shortName) {
        var response = $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json"),
          params: {
            category: shortName
          }
        });
    
        return response;
      };
    
    }
    
    })();