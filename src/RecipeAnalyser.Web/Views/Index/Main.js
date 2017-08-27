
var app = angular.module('recipeApp', []);

app.factory('ingredientsSvc', [function () {
    return [
        { key: "default", value: "Please select an ingredient..." },
        { key: "whiteFlour", value: "White flour", carbs: { total: 71.2, sugars: 1.8 }, fats: { total: 2.2, saturated: 1.4 }, fibre: 2.9, proteins: 10.5, salt: 0 },
        { key: "erythritol", value: "Erythritol", carbs: { total: 0, sugars: 0 }, fats: { total: 0, saturated: 0 }, fibre: 0, proteins: 0, salt: 0 },
        { key: "egg", value: "Eggs", fats: { total: 9.6, saturated: 2.7 }, carbs: { total: 0.25, sugars: 0.25 }, proteins: 14.1, fibre: 0.25, salt: 0.38 },
        { key: "milk", value: "Milk", fats: { total: 3.6, saturated: 2.3 }, carbs: { total: 4.6, sugars: 4.6 }, proteins: 3.4, fibre: 0.25, salt: 0.11 },
        { key: "mascarpone", value: "Mascarpone", fats: { total: 42, saturated: 30.4 }, carbs: { total: 4.9, sugars: 4.6 }, proteins: 3.6, fibre: 0, salt: 0.13 },
        { key: "activeYeast", value: "Active yeast", fats: { total: 3.8, saturated: 1.3 }, carbs: { total: 16.9, sugars: 0.25 }, proteins: 44.5, fibre: 19.2, salt: 0.35 },
        { key: "bakingPowder", value: "Baking powder", fats: { total: 0, saturated: 0 }, carbs: { total: 28, sugars: 0 }, proteins: 0, fibre: 0.2, salt: 0 },
        { key: "butter", value: "Butter", fats: { total: 2.2, saturated: 1.4 }, carbs: { total: 71.2, sugars: 1.8 }, proteins: 10.5, fibre: 2.9, salt: 0.1 },
        { key: "oatsFlour", value: "Oatmeal flour", fats: { total: 8.4, saturated: 1.3 }, carbs: { total: 56.1, sugars: 1 }, proteins: 12.1, fibre: 9.1, salt: 0 }];
}]);

app.controller('RecipeCtrl', RecipeCtrl);
app.controller('IngredientCtrl', IngredientCtrl);

app.directive('dirEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.dirEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});

function RecipeCtrl($scope, ingredientsSvc) {
    $scope.carbsTotal = 0;
    $scope.sugarsTotal = 0;
    $scope.fatsTotal = 0;
    $scope.satFatsTotal = 0;
    $scope.fibreTotal = 0;
    $scope.proteinsTotal = 0;

    $scope.addIngredient = function () {
        AddIngredient($scope);
    }

    $scope.ingredients = ingredientsSvc;

    $scope.ingredientSelect = { key: "default", value: "Please select an ingredient..." };
}

function IngredientCtrl($scope) {

    $scope.calculateAmount = function (ingredient) {
        var ingredients = $scope.ingredients;
        CalculateAmounts(ingredients, ingredient);
    };
    $scope.quantity = 0;
}


//functions

function CalculateAmounts(ingredients, currentIngredient) {
    var elementKey = currentIngredient.key;

    var currentIngredientDefault = SingleOrDefaultElementByKey(ingredients, elementKey);
    var ingredientQuantity = currentIngredient.quantity;

    currentIngredient.carbs.total = CalculateAmount(currentIngredientDefault, 'carbs.total', ingredientQuantity);
    currentIngredient.carbs.sugars = CalculateAmount(currentIngredientDefault, 'carbs.sugar', ingredientQuantity);
    currentIngredient.fats.total = CalculateAmount(currentIngredientDefault, 'fats.total', ingredientQuantity);
    currentIngredient.fats.saturated = CalculateAmount(currentIngredientDefault, 'fats.saturated', ingredientQuantity);
    currentIngredient.proteins = CalculateAmount(currentIngredientDefault, 'proteins', ingredientQuantity);
    currentIngredient.fibre = CalculateAmount(currentIngredientDefault, 'fibre', ingredientQuantity);

}

function CalculateAmount(currentIngredientDefault, defaultValueName, quantity) {
    var result;
    if (quantity) {
        var referenceValue = GetDescendantProp(currentIngredientDefault, defaultValueName);

        result = referenceValue / 100 * quantity;
    } else {
        result = 0;
    }

    return result;
}

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

        scope.recipeIngredients.push(selectedIngredient);
        UpdateTotals(scope);
    }
}

function SumObjectsArrayProperty(items, prop, subprop) {
    var result = items.reduce(function (a, b) {
        var propElement = b[prop];
        var adder;
        if (subprop) {
            var subPropElement = propElement[subprop];
            adder = subPropElement;
        } else {
            adder = propElement;
        }
        var result = a + adder;

        return result;
    }, 0);

    return result;
};

function UpdateTotals($scope) {
    $scope.sugarsTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'carbs', 'sugars').toFixed(2);
    $scope.carbsTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'carbs', 'total').toFixed(2);
    $scope.fatsTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'fats', 'total').toFixed(2);
    $scope.satFatsTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'fats', 'saturated').toFixed(2);
    $scope.proteinsTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'proteins').toFixed(2);
    $scope.fibreTotal = SumObjectsArrayProperty($scope.recipeIngredients, 'fibre').toFixed(2);

}

function GetDescendantProp(obj, propertyPath) {
    var arr = propertyPath.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}





