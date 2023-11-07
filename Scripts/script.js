﻿/// <reference path="angular.js" />
/// <reference path="angular-route.js" />

var app = angular
                 .module("Demo", ["ui.router"])
                 .config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
                     $urlRouterProvider.otherwise("/home")
                     $urlMatcherFactoryProvider.caseInsensitive(true);
                     $stateProvider
                         .state("home", {
                             url: "/home",
                             templateUrl: "Templates/home.html",
                             controller: "homeController as homeCtrl",
                             controllerAs: "homeCtrl",
                             data: {
                                 customData1: "Home State Custom Data 1",
                                 customData2: "Home State Custom Data 2",
                             }
                         })
                         .state("courses", {
                             url: "/courses",
                             templateUrl: "Templates/courses.html",
                             controller: "coursesController",
                             controllerAs: "coursesCtrl",
                             data: {
                                 customData1: "Courses State Custom Data 1",
                                 customData2: "Courses State Custom Data 2",
                             }
                         })
                         .state("students", {
                             url: "/students",
                             templateUrl: "Templates/students.html",
                             controller: "studentsController",
                             controllerAs: "studentsCtrl",
                             resolve: {
                                 studentsList: function ($http) {
                                     return $http.get("StudentService.asmx/GetAllStudents")
                                          .then(function (response) {
                                              return response.data
                                          })
                                 }
                             }
                         })
                         .state("studentDetails", {
                             url: "/students/:id",
                             templateUrl: "Templates/studentDetails.html",
                             controller: "studentDetailsController",
                             controllerAs: "studentDetailsCtrl"
                         })
                         .state("studentsSearch", {
                             url:"/studentsSearch/:name",
                             templateUrl: "Templates/studentsSearch.html",
                             controller: "studentsSearchController",
                             controllerAs: "studentsSearchCtrl"
                         })
                   
                     $locationProvider.html5Mode(true);
                 })
                 .controller("homeController", function ($state) {
                     this.message = "Home Page";

                     this.homeCustomData1 = $state.current.data.customData1
                     this.homeCustomData2 = $state.current.data.customData2

                     this.coursesCustomData1 = $state.get("courses").data.customData1
                     this.coursesCustomData2 = $state.get("courses").data.customData2
                 })
                 .controller("coursesController", function () {
                     this.courses = ["C#", "VB.NET", "SQL Server", "ASP.NET"];
                 })
                 .controller("studentsController", function (studentsList, $state, $location) {
                     var vm = this;

                     vm.searchStudent = function () {
                         $state.go("studentsSearch", {name: vm.name})
                     }

                     vm.reloadData = function () {
                         $state.reload();
                     }

                     vm.students = studentsList;
                 })
                .controller("studentDetailsController", function ($http, $stateParams) {
                    var vm = this;
                    $http({
                        url: "StudentService.asmx/GetStudent",
                        params: { id: $stateParams.id },
                        method: "get"
                    })
                    .then(function (response) {
                        vm.student = response.data
                    })
                })
                .controller("studentsSearchController", function ($http, $stateParams) {
                    var vm = this;

                    if ($stateParams.name) {
                        $http({
                            url: "StudentService.asmx/GetStudentsByName",
                            method: "get",
                            params: { name: $stateParams.name }
                        }).then(function (response) {
                           vm.students = response.data
                       })
                    }
                    else {
                        $http.get("StudentService.asmx/GetAllStudents")
                          .then(function (response) {
                              vm.students = response.data
                          })
                    }
                });