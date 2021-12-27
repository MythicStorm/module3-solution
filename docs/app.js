(function () {
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItems);


    function FoundItems() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
              menuItems: '=myMenuItems'
            },
            controller: NarrowItDownController,
            controllerAs: 'menu',
            bindToController: true
        };

        return ddo;
    }
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var menu = this;
      menu.searchItem = "";
      menu.menuItems = [];
      menu.searchItemNotFound = false;
      
      var promise = MenuSearchService.getMatchedMenuItems();
        
        promise.then(function (response) {
            menu.categories = response.data;
          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });


      menu.logMenuItems = function () {
        if(MenuSearchService.isEmptySearch(menu.searchItem)) {
          menu.searchItemNotFound = true;
          menu.menuItems = [];
        }
        else {
          var promise = MenuSearchService.getMatchedMenuItems();
        
          promise.then(function (response) {
            var categories = response.data;            
            menu.menuItems = MenuSearchService.sortMenuItems(menu.categories, menu.searchItem);

            if(menu.menuItems.length <= 0)
            {
              menu.searchItemNotFound = true;
            }
            else
            {
              menu.searchItemNotFound = false;
            }

          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });
        }
      };  

      menu.removeMenuListItems = function(itemIndex) {
        menu.menuItems =  MenuSearchService.removeMenuListItem(menu.menuItems, itemIndex);
      };
    }
    
    
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
      var service = this;
      
    
      service.getMatchedMenuItems = function () {
        var response = $http({
          method: "GET",
          url: (ApiBasePath + "/menu_items.json")
        });

        return response;
      };
      
      service.sortMenuItems = function(itemList, searchItem){     
        var menuItems = [];
        for(var i = 0; i < itemList.menu_items.length; i++)
        {        
          if(itemList.menu_items[i].description.indexOf(searchItem) !== -1)
          {
            menuItems.push(itemList.menu_items[i])
          }              
        }

        return menuItems;
      };  
      
      service.removeMenuListItem = function(menuList, itemIndex) {
        menuList.splice(itemIndex, 1);
        return menuList;
      };

      service.isEmptySearch = function(searchItem) {
        return searchItem === null || searchItem.match(/^ *$/) !== null;
      };
    }
  })();