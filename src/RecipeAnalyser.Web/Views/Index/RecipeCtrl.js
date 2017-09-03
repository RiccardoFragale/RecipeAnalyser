app.controller('RecipeCtrl', RecipeCtrl);

function RecipeCtrl($scope, ingredientsSvc, recipeTotalsSvc) {

    $scope.$watch(function () { return recipeTotalsSvc.get(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.recipeTotals = newValue;
    });

    $scope.addIngredient = function () {
        AddIngredient($scope);
    }

    $scope.ingredients = ingredientsSvc;

    $scope.ingredientSelect = { key: "default", value: "Please select an ingredient..." };
}

//functions

function SingleOrDefaultElementByKey(elements, key) {
    var filteredElements = elements.filter(function (item) {
        return item.key === key;
    });

    if (filteredElements.length > 1) {
        throw "Duplicates keys are not allowed in the ingredientSelect array!";
    }
    var result = filteredElements[0];

    return result;
}

function AddIngredient(scope) {
    scope.recipeIngredients = scope.recipeIngredients || [];
    var selectedItemKey = scope.ingredientSelect.key;

    var filteredElement = SingleOrDefaultElementByKey(scope.recipeIngredients, selectedItemKey);

    var isElementPresent = filteredElement;
    var isElementNotDefault = scope.ingredientSelect.key === "default";

    if (!isElementPresent && !isElementNotDefault) {
        var selectedIngredient = scope.ingredientSelect;
        selectedIngredient.carbs.total = 0;
        selectedIngredient.carbs.sugars = 0;
        selectedIngredient.fats.total = 0;
        selectedIngredient.fats.saturated = 0;
        selectedIngredient.proteins = 0;
        selectedIngredient.fibre = 0;
        selectedIngredient.salt = 0;

        scope.recipeIngredients.push(selectedIngredient);
    }
}







