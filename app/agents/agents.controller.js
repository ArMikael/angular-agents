(function () {
    'use strict';

    angular.module('agentsApp.agents', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/agents', {
                templateUrl: 'agents/agents.html',
                controller: 'AgentsCtrl'
            });
        }])

        .controller('AgentsCtrl', ['$scope', 'agentsFactory', function($scope, agentsFactory) {
            const agents = agentsFactory.getAgents();

            $scope.isolatedAgents = [];
            $scope.isolatedCountries = [];
            $scope.sortedIsolatedCountries = [];

            // Convert date to timestamp with date.js library and add timestamp property to all agents objects for sorting
            let agentsWithTimestamp = agents.map((agent, index, arr) => {
                arr[index].timestamp = Date.parse(agent.date)/1000;
                return agent;
            });

            // Sorting objects by timestamp to show agents in table in ascending date order
            $scope.agentsSortedByTimestamp = agentsWithTimestamp.sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });

            $scope.agentsSortedByName = agents.sort(function (a, b) {
                return a.agent - b.agent;
            });


            // function findMostIsoldatedCountry() {
            //     $scope.sortedIsolatedCountries = $scope.isolatedCountries.sort();
            //
            //     let currentNumber = 0;
            //     let maximumCountryName = '';
            //     let maximumCount = 0;
            //
            //     $scope.sortedIsolatedCountries.forEach((country, index, arrCountries) => {
            //         if (!!arrCountries[index+1] && country === arrCountries[index+1]) {
            //             currentNumber++;
            //         } else {
            //             if (currentNumber > maximumCount) {
            //                 maximumCount = currentNumber;
            //                 maximumCountryName = country;
            //             }
            //
            //             currentNumber = 1;
            //         }
            //     });
            //
            //     $scope.mostIsolatedCountry = maximumCountryName;
            //     $scope.isolationDegree = maximumCount;
            //
            //     console.log('isolated countries: ', $scope.sortedIsolatedCountries);
            // }

            function findMostIsoldatedCountry() {
                let reducedCountries = $scope.isolatedCountries.reduce(function(prevArr, nextVal){
                    prevArr[nextVal] = (prevArr[nextVal] + 1) || 1;
                    return prevArr;
                },{});

                return Object.keys(reducedCountries).sort(function(a,b){
                    return reducedCountries[b]-reducedCountries[a]
                });
            }


            function checkIsolatedAgents() {
                let currentNumber = 1;
                let currentPersonAgent = $scope.agentsSortedByName[0].agent;

                $scope.agentsSortedByName.forEach((person, index, arr) => {
                    // If next cell with agent doesn't exist
                    if (!arr[index+1]) {
                        if (currentPersonAgent !== arr[index-1].agent) {
                            $scope.isolatedCountries.push(person.country);
                        }
                    // If current agent name is not equal to the next one
                    } else if (currentPersonAgent !== arr[index+1].agent) {
                        if (currentNumber === 1) {
                            $scope.isolatedCountries.push(person.country);
                        }

                        currentNumber = 1;
                        currentPersonAgent = arr[index+1].agent;

                    // If current agent name equal to the next one
                    } else {
                        currentNumber++;
                    }
                });

                $scope.sortedIsolatedCountries = findMostIsoldatedCountry();
            }

            checkIsolatedAgents();
        }]);

})();