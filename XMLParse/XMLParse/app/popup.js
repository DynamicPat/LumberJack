angular.module('LumberJack', ['ngMessages'])
      .controller('LumberJackController', function ($scope) {

        $scope.hasBeenParsed = false;
        $scope.filter = {
            textSearch: "NewStreamline",
            removeOuterElement: true
        };
        $scope.pivotalTrackerProjectID = "123456";
        $scope.pivotalTrackerAPIToken = "ex4mp13";
        $scope.matchedStories = [];
        $scope.parse = parse;
        $scope.checkTrackerItemsValid = checkTrackerItemsValid;
        $scope.clear = clear;
        $scope.highlightText = highlightText;
        $scope.executeTrackerApiFetch = executeTrackerApiFetch;
        $scope.goToStory = goToStory;

        function checkTrackerItemsValid() {
            var invalid = true;

            if ($scope.pivotalTrackerProjectID.length > 3) {
                invalid = false;
            }
            if ($scope.pivotalTrackerAPIToken.length > 5) {
                invalid = false;
            }

            return invalid;
        }

        function clear() {
            $scope.parseBlock = "";
            $scope.parseOutPut = [];
            $scope.hasBeenParsed = false;
            $scope.filter.textSearch = "";
        }

        function cutElement(value, element) {
            return value.substring(value.indexOf(("/" + element.Name.trim()), value.indexOf(element.Name) - 1 + element.TotalLength) + element.TotalLength).trim();
        }

        function cutOuterElement(value) {
            return value.substring(value.indexOf("<", 2), value.lastIndexOf("<", value.lastIndexOf("<"))).trim();
        }

        function executeTrackerApiFetch() {
            // compose request URL
            var url = 'https://www.pivotaltracker.com/services/v5';
            url += '/projects/' + $scope.pivotalTrackerProjectID;
            url += '/stories?filter=description:';

            if ($scope.parseOutPut.length > 0) {
                for (var i = 0; i < $scope.parseOutPut.length; i++) {
                    var iterationOutput = $scope.parseOutPut[i];
                    var iterationUrl = url;
                    if (iterationOutput.Value.trim().length > 0) {
                        iterationUrl += '"' + iterationOutput.Value + '"';
                        $.ajax({
                            url: iterationUrl,
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('X-TrackerToken', $scope.pivotalTrackerAPIToken);
                            },
                            success: function (stories) {
                                if (stories != null && stories.length > 0) {
                                    $scope.matchedStories.push(stories);
                                }
                            },
                            fail: function (errorData) {

                            }
                        });
                    }
                }
            }            
        }

        function getElementValue(value, elementLength) {
            return value.substring(elementLength, value.indexOf("<", elementLength));
        }

        function getOuterElementProperty(value) {
            var element = {
                Name: getOuterElementPropertyName(value),
                TotalLength: getOuterElementPropertyLength(value)
            };

            element.Value = getElementValue(value, element.TotalLength);

            return element;
        }

        function getOuterElementPropertyLength(value) {
            return value.substring(0, value.indexOf(">") + 1).length;
        }

        function getOuterElementPropertyName(value) {
            return value.substring(value.indexOf("<") + 1, value.indexOf(">"));
        }

        function goToStory(url) {
            window.open(url);
        }

        function hasNextElement(value) {
            return value.substring(value.indexOf("<"), value.indexOf("/")).length > 2;
        }

        function highlightText() {
            var outputElementIDCounter = 0;
            var outputElementID = "value_output_" + outputElementIDCounter.toString();
            var outputElement = document.getElementById(outputElementID);
            while (outputElement !== null) {
                var searchedText = $scope.filter.textSearch.trim();
                var subString = '<span style="color:red">' + outputElement.innerHTML.substring(outputElement.innerHTML.indexOf(searchedText), outputElement.innerHTML.indexOf(searchedText) + searchedText.length) + '</span>';
                var regex = new RegExp(searchedText, "g");
                outputElement.innerHTML = outputElement.innerHTML.replace(regex, subString);

                outputElementID = outputElementID.substring(0, (outputElementID.length - outputElementIDCounter.toString().length)) + (++outputElementIDCounter).toString();
                outputElement = document.getElementById(outputElementID);
            }
        }

        function parse() {
            var value = $scope.parseBlock;
            var items = [];

            if ($scope.filter.removeOuterElement) {
                value = cutOuterElement(value);
            }

            while (hasNextElement(value)) {
                var element = getOuterElementProperty(value)
                items.push(element);
                value = cutElement(value, element);
            }

            $scope.hasBeenParsed = true;
            $scope.parseOutPut = items;
        }
    });


function init()
{
    
}



