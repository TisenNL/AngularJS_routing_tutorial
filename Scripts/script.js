﻿/// <reference path="angular.js" />
/// <reference path="angular-route.js" />

var app = angular
                 .module("Demo", ["ngRoute"])
                 .config(function ($routeProvider, $locationProvider) {
                     $routeProvider.caseInsensitiveMatch = true;

                     $routeProvider
                         .when("/home", {
                             templateUrl: "Templates/home.html",
                             controller: "homeController as homeCtrl",
                             controllerAs: "homeCtrl"
                         })
                         .when("/courses", {
                             templateUrl: "Templates/courses.html",
                             controller: "coursesController",
                             controllerAs: "coursesCtrl"
                         })
                         .when("/students", {
                             templateUrl: "Templates/students.html",
                             controller: "studentsController",
                             controllerAs: "studentsCtrl"
                         })
                         .when("/students/:id", {
                             templateUrl: "Templates/studentDetails.html",
                             controller: "studentDetailsController",
                             controllerAs: "studentDetailsCtrl"
                         })
                         .when("/studentsSearch/:name?", {
                             templateUrl: "Templates/studentsSearch.html",
                             controller: "studentsSearchController",
                             controllerAs: "studentsSearchCtrl"
                         })
                         .otherwise({
                             redirectTo: "/home"
                         })
                     $locationProvider.html5Mode(true);
                 })
                 .controller("homeController", function () {
                     this.message = "Home Page";
                 })
                 .controller("coursesController", function () {
                     this.courses = ["C#", "VB.NET", "SQL Server", "ASP.NET"];
                 })
                 .controller("studentsController", function ($http, $route, $scope, $log, $location) {
                     var vm = this;

                     vm.searchStudent = function () {
                         if (vm.name) {
                             $location.url("/studentsSearch/" + vm.name);
                         } else {
                             $location.url("/studentsSearch");
                         }
                     }

                     $scope.$on("$locationChangeStart", function (event, next, current) {
                         $log.debug("$locationChangeStart fired");
                         $log.debug(event);
                         $log.debug(next);
                         $log.debug(current);
                     });

                     $scope.$on("$routeChangeStart", function (event, next, current) {
                         $log.debug("$routeChangeStart fired");
                         $log.debug(event);
                         $log.debug(next);
                         $log.debug(current);
                     });

                     vm.reloadData = function () {
                         $route.reload();
                     }

                     $http.get("StudentService.asmx/GetAllStudents")
                          .then(function (response) {
                              vm.students = response.data
                          })
                 })
                .controller("studentDetailsController", function ($http, $routeParams) {
                    var vm = this;
                    $http({
                        url: "StudentService.asmx/GetStudent",
                        params: { id: $routeParams.id },
                        method: "get"
                    })
                    .then(function (response) {
                        vm.student = response.data
                    })
                })
                .controller("studentsSearchController", function ($http, $routeParams) {
                    var vm = this;

                    if ($routeParams.name) {
                        $http({
                            url: "StudentService.asmx/GetStudentsByName",
                            params: { name: $routeParams.name },
                            method: "get"
                        })
                       .then(function (response) {
                           vm.students = response.data
                       })
                    }
                    else
                    {
                        $http.get("StudentService.asmx/GetAllStudents")
                          .then(function (response) {
                              vm.students = response.data
                          })
                    }
                });