//TODO: 
// Allow dynamically choosing the number of elements to group together (Default 2)
// Allow dynamically choosing to remove the outer element (Default true)
// Make smart enough to recognize a true tree structure (embedded elements)
// Make lazy loading, so not all branches have to be loaded at once (4 default, maybe have a click event that loads the next four children down on a clicked section)
// Allow dynamically choosing the number of children to load at a time (4 default?)

angular.module('LumberJack', [])
      .controller('LumberJackController', function ($scope) {
          $scope.hasBeenParsed = false;
          $scope.filter = {
              textSearch: "NewStreamline",
              removeOuterElement: true
          };
          $scope.parse = parse;
          $scope.clear = clear;
          $scope.highlightText = highlightText;

          function clear() {
              $scope.parseBlock = "";
              $scope.parseOutPut = [];
              $scope.hasBeenParsed = false;
          }

          //Parses the XML
          function parse() {
              var value = $scope.parseBlock;
              var items = [];

              if ($scope.filter.removeOuterElement) {
                  //Cut off Outer Element
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

          function hasNextElement(value) {
              return value.substring(value.indexOf("<"), value.indexOf("/")).length > 2;
          }

          function highlightText() {
              var outputElementIDCounter = 0;
              var outputElementID = "value_output_" + outputElementIDCounter.toString();
              var outputElement = document.getElementById(outputElementID);
              while (outputElement != null) {
                  var searchedText = $scope.filter.textSearch.trim();
                  var subString = '<span style="color:red">' + outputElement.innerHTML.substring(outputElement.innerHTML.indexOf(searchedText), outputElement.innerHTML.indexOf(searchedText) + searchedText.length) + '</span>';
                  var regex = new RegExp(searchedText, "g");
                  outputElement.innerHTML = outputElement.innerHTML.replace(regex, subString);

                  outputElementID = outputElementID.substring(0, (outputElementID.length - outputElementIDCounter.toString().length)) + (++outputElementIDCounter).toString();
                  outputElement = document.getElementById(outputElementID);
              }
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

          function getElementValue(value, elementLength) {
              return value.substring(elementLength, value.indexOf("<", elementLength));
          }

          function cutElement(value, element) {
              return value.substring(value.indexOf(element.Name, value.indexOf(element.Name) - 1 + element.TotalLength) + element.TotalLength - 1).trim();
          }

          function cutOuterElement(value) {
              return value.substring(value.indexOf("<", 2), value.lastIndexOf("<", value.lastIndexOf("<"))).trim();
          }
      });


function init()
{
    
}



