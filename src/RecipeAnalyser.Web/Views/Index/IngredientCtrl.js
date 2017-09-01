
app.controller('IngredientCtrl', IngredientCtrl);

function IngredientCtrl($scope, recipeTotalsSvc) {

    $scope.calculateAmount = function (ingredient) {
        var ingredients = $scope.ingredients;
        CalculateAmounts(ingredients, ingredient);
        UpdateTotals($scope, recipeTotalsSvc);
        SaveRecipeToFile($scope.ingredients);
    };

    $scope.quantity = 0;
}

//functions

function SaveRecipeToFile(ingredients) {
    var txtFile = "/tmp/test.txt";
    var file = new File(txtFile, "write", false);
    var str = JSON.stringify(ingredients);

    log("opening file...");
    file.open();
    log("writing file..");
    file.writeline(str);
    file.close();
}

function CalculateAmounts(ingredients, currentIngredient) {
    var elementKey = currentIngredient.key;

    var currentIngredientDefault = SingleOrDefaultElementByKey(ingredients, elementKey);
    var ingredientQuantity = currentIngredient.quantity;

    currentIngredient.carbs.total = CalculateAmount(currentIngredientDefault, 'carbs.total', ingredientQuantity);
    currentIngredient.carbs.sugars = CalculateAmount(currentIngredientDefault, 'carbs.sugars', ingredientQuantity);
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

function SumObjectsArrayProperty(items, propertyPath) {
    var result = items.reduce(function (a, b) {
        var element = GetDescendantProp(b, propertyPath);
        var result = 0;
        if (element) {
            result = a + element;
        }

        return result;
    }, 0);

    return result;
};

function UpdateTotals($scope, recipeTotalsSvc) {
    var recipeTotalsObj = {
        carbsTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'carbs.total'),
        sugarsTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'carbs.sugars'),
        fatsTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'fats.total'),
        satFatsTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'fats.saturated'),
        fibreTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'fibre'),
        proteinsTotal: SumObjectsArrayProperty($scope.recipeIngredients, 'proteins')
    };

    recipeTotalsSvc.set(recipeTotalsObj);
}

function GetDescendantProp(obj, propertyPath) {
    var arr = propertyPath.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}





