/*
app.js - class-scorecard-app
Developed by Sankalp Lakhina [ sankalp.lakhina91@gmail.com ]
*/

/*global window, angular*/

(function (angular, $) {
    'use strict';

    // activating bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();


    // fixes the class performance report section to window on scroll of page
    var fixmeTop = $('#class-report').offset().top;
    $(window).scroll(function () {
        var currentScroll = $(window).scrollTop();
        if (currentScroll >= fixmeTop) {
            $('#class-report').css({
                position: 'fixed',
                top: '0',
                right: '31.5px'
            });
        } else {
            $('#class-report').css({
                position: 'static'
            });
        }
    });


    // angular app declaration
    var app = angular.module('classScorecardApp', ['ngStorage']);


    /* Shared service factory which helps interact between HeaderController and AppController */
    app.factory('SharedService', ['$rootScope', function ($rootScope) {

        var factory = {};

        function broadcastMessage(msgStr) {
            $rootScope.$broadcast(msgStr);
        }

        factory.addStudent = function (newstudent) {
            broadcastMessage('AddStudent');
        };

        return factory;
    }]);


    /* Header Controller to manage view model changes from Header */
    app.controller('HeaderController', ['$scope', 'SharedService', '$localStorage','$window','$timeout', function ($scope, SharedService, $localStorage, $window, $timeout) {

        // broadcasts the Addstudent event via SharedService
        $scope.addNewStudent = function () {
            SharedService.addStudent();
        };

        // clears all the local storage data and reloads the page with new data
        $scope.clearLocalstorage = function () {

            $localStorage.$reset();
            $timeout(function(){
                $window.location.reload();

            }, 100);
        };

    }]);


    /* App Controller to control view model updations between Student list and model data */
    app.controller('AppController', ['$scope', '$localStorage', 'SharedService', '$rootScope', '$timeout', '$filter', function ($scope, $localStorage, SharedService, $rootScope, $timeout, $filter) {

        var studentReference,
            selectedStudentIndex,
            promise;

        $scope.modalObj = {
            name: '',
            score: '',
            id: null
        };

        $scope.summaryReport = {
            min: {
                studentName: '',
                studentScore: ''
            },
            max: {
                studentName: '',
                studentScore: ''
            },
            avgScore: ''
        };

        // checking if the localstorage exists, else creating a localstorage of default list
        $localStorage.studentList ? '' : $localStorage.$default({studentList: addStaticValues()});

        $scope.studentList = $localStorage.studentList;       

        function addStaticValues () {
            var arr = [];
            for (var i = 0; i < 3; i++) {
                arr.push({
                    name: 'Student ' + i,
                    id: i,
                    score: Number(Math.floor(Math.random() * 100))
                });
            }
            return arr;
        }

        // clears the errorMsg and timeout
        function clearErrorMsg () {
            $timeout.cancel(promise);
            promise = $timeout(function(){
                $scope.errorMsg = '';
            }, 3000);
        }


        // watching the name model, performing validation and then calculates class performance
        $scope.$watch('modalObj.name', function (newVal, oldVal) {

            if( $scope.modalObj.name.length >= 40 ) {

                $scope.modalObj.name = $scope.modalObj.name.substring(0, $scope.modalObj.name.length - 1);
                $scope.errorMsg = 'Name can not be more than 40 characters.';
                clearErrorMsg();
            } else if ( $scope.modalObj.name.length === 0 &&  $scope.modalObj.id != null) {
                $scope.modalObj.name = oldVal;
                $scope.errorMsg = 'Name can not be blank.';
                clearErrorMsg();
            }
            calculateSummaryReport();
        });


        // watching the score model, performing validation and then calculates class performance
        $scope.$watch('modalObj.score', function(newVal, oldVal){

            if (isNaN(Number($scope.modalObj.score))) {
                $scope.modalObj.score = Number($scope.modalObj.score.substring(0, $scope.modalObj.score.length - 1));
                $scope.errorMsg = 'Score can not have alphabets.';
                clearErrorMsg();

            } else {

                if (Number($scope.modalObj.score) > 100 || Number($scope.modalObj.score) < 0) {

                    $scope.modalObj.score = Number($scope.modalObj.score.substring(0, $scope.modalObj.score.length - 1));
                    $scope.errorMsg = 'Score should range in between 0 - 100.';
                    clearErrorMsg();
                }
                if ($scope.modalObj.score.length === 0 && $scope.modalObj.id != null ) {
                    $scope.modalObj.score = Number(oldVal);
                    $scope.errorMsg = 'Score can not be blank.';
                    clearErrorMsg();
                }
                else {
                    $scope.modalObj.score = Number(newVal);
                }


            }
            calculateSummaryReport();
        });

        // catching the broadcasted AddStudent event and opens the Modal window to add student to the student list
        $rootScope.$on('AddStudent', function () {

            $scope.modalObj = {
                name: '',
                score: '',
                id: null
            };

            $('#StudentModal').modal('show');
        });


        // opens the modal window with current clicked student details, keeps reference of it so that it is updated as soon as any changes are made
        $scope.editStudentDetails = function (student, index) {

            $scope.modalObj = student;
            selectedStudentIndex = index;
            $('#StudentModal').modal('show');
        };


        // Adds student details from Modal window to studentList
        $scope.saveStudentDetails = function () {

            var student = $scope.modalObj;
            var studentList = $scope.studentList;

            if (student.id  === null) { // Adding new student

                studentList.unshift({
                    name: student.name,
                    id: new Date().getTime(),
                    score: Number(student.score)
                });

            }
            $scope.sortList();
        };


        // deletes clicked student in from the student list
        $scope.deleteStudent = function (selectedStudent) {

            var studentList = $scope.studentList,
                studentIndex = -1;
            angular.forEach(studentList, function(student, index){

                if (student.id == selectedStudent.id){
                    studentIndex = index;
                }
            });
            if (studentIndex > -1){
                studentList.splice(studentIndex, 1);
            }
        };

        
        // calculates the class performance report and binds it to model
        function calculateSummaryReport() {
            var scoresArr = [],
                sum = 0;
            angular.forEach($scope.studentList, function(student){
                sum += Number(student.score);
                scoresArr.push(Number(student.score));
            });
            var sortedArr = $filter('orderBy')($scope.studentList, '-score');
            
            if(scoresArr.length && sortedArr.length){
                
                $scope.summaryReport.min.studentName = sortedArr[0].name;
                $scope.summaryReport.min.studentScore = sortedArr[0].score;
                $scope.summaryReport.max.studentName = sortedArr[sortedArr.length -1].name;
                $scope.summaryReport.max.studentScore = sortedArr[sortedArr.length -1].score;
                $scope.summaryReport.avgScore = (sum / scoresArr.length).toFixed(2);
            } else {

                $scope.summaryReport = {
                    min: {
                        studentName: '',
                        studentScore: ''
                    },
                    max: {
                        studentName: '',
                        studentScore: ''
                    },
                    avgScore: ''
                }; 
            }

        }


        /* Sort functionality to sort rows based on name or score */
        $scope.sortByNameFlag = true;
        $scope.sortByScoreFlag = true;
        var lastSortQuery;
        $scope.sortList = function (sortQuery) {
            var reverseFlag;
            lastSortQuery = sortQuery || lastSortQuery;
            if (sortQuery === 'name') {
                reverseFlag = $scope.sortByNameFlag = !$scope.sortByNameFlag;
            } else if ( sortQuery === 'score') {
                reverseFlag = $scope.sortByScoreFlag = !$scope.sortByScoreFlag;
            }
            $scope.studentList = $filter('orderBy')($scope.studentList, lastSortQuery, reverseFlag);
            $('[data-toggle="tooltip"]').tooltip('hide');
        };


    }]);

}(window.angular, window.jQuery));