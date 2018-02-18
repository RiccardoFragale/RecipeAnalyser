
app.controller('IngredientCtrl', IngredientCtrl);

function IngredientCtrl($scope, recipeTotalsSvc) {

    $scope.calculateAmount = function (ingredient) {
        var ingredients = $scope.ingredients;
        SetIngredientAmounts(ingredients, ingredient);
        SetRecipeTotals($scope, recipeTotalsSvc);
        //SaveRecipeToFile($scope.ingredients);
    };

    $scope.remove = function (currentIngredient) {
        RemoveIngredient($scope, currentIngredient);
        SetRecipeTotals($scope, recipeTotalsSvc);
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

function SetIngredientAmounts(ingredients, currentIngredient) {
    var elementKey = currentIngredient.key;

    var currentIngredientDefault = SingleOrDefaultElementByKey(ingredients, elementKey);
    var ingredientQuantity = currentIngredient.quantity;

    currentIngredient.carbs.total = CalculateAmount(currentIngredientDefault, 'carbs.total', ingredientQuantity);
    currentIngredient.carbs.sugars = CalculateAmount(currentIngredientDefault, 'carbs.sugars', ingredientQuantity);
    currentIngredient.fats.total = CalculateAmount(currentIngredientDefault, 'fats.total', ingredientQuantity);
    currentIngredient.fats.saturated = CalculateAmount(currentIngredientDefault, 'fats.saturated', ingredientQuantity);
    currentIngredient.proteins = CalculateAmount(currentIngredientDefault, 'proteins', ingredientQuantity);
    currentIngredient.fibre = CalculateAmount(currentIngredientDefault, 'fibre', ingredientQuantity);
    currentIngredient.salt = CalculateAmount(currentIngredientDefault, 'salt', ingredientQuantity);

    var netCarbs = currentIngredient.carbs.total - currentIngredient.fibre; // - polyalcohols
    netCarbs = (netCarbs > 0 ? netCarbs : 0);

    var nutritionalTotal = netCarbs + currentIngredient.fats.total + currentIngredient.proteins;

    var carbsNutritionalPercentage;
    if (netCarbs > 0) {
        carbsNutritionalPercentage = nutritionalTotal / netCarbs * 100;
    } else {
        carbsNutritionalPercentage = 0;
    }

    currentIngredient.nutritional = {
        total: nutritionalTotal,
        carbsPercentage: carbsNutritionalPercentage,
        netCarbs: netCarbs
    };
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

function SetRecipeTotals(scope, recipeTotalsSvc) {
    var recipeIngredients = scope.recipeIngredients;
    var recipeTotalsObj = {
        carbsTotal: SumObjectsArrayProperty(recipeIngredients, 'carbs.total'),
        sugarsTotal: SumObjectsArrayProperty(recipeIngredients, 'carbs.sugars'),
        fatsTotal: SumObjectsArrayProperty(recipeIngredients, 'fats.total'),
        satFatsTotal: SumObjectsArrayProperty(recipeIngredients, 'fats.saturated'),
        fibreTotal: SumObjectsArrayProperty(recipeIngredients, 'fibre'),
        proteinsTotal: SumObjectsArrayProperty(recipeIngredients, 'proteins'),
        saltTotal: SumObjectsArrayProperty(recipeIngredients, 'salt'),
        recipeTotal: SumObjectsArrayProperty(recipeIngredients, 'quantity'),
        netCarbs: SumObjectsArrayProperty(recipeIngredients, 'nutritional.netCarbs'),
        nutritionTotal: SumObjectsArrayProperty(recipeIngredients, 'nutritional.total')
    };

    recipeTotalsObj.carbsPercentage = recipeTotalsObj.carbsTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.sugarsPercentage = recipeTotalsObj.sugarsTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.fatsPercentage = recipeTotalsObj.fatsTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.satFatsPercentage = recipeTotalsObj.satFatsTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.proteinsPercentage = recipeTotalsObj.proteinsTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.fibrePercentage = recipeTotalsObj.fibreTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.saltPercentage = recipeTotalsObj.saltTotal / recipeTotalsObj.recipeTotal * 100;
    recipeTotalsObj.nutritionPercentage = recipeTotalsObj.netCarbs / recipeTotalsObj.nutritionTotal * 100;

    recipeTotalsSvc.set(recipeTotalsObj);
}

function SumObjectsArrayProperty(items, propertyPath) {
    var result = items.reduce(function (a, b) {
        var targetPropertyValue = GetDescendantProp(b, propertyPath);
        var element = parseFloat(targetPropertyValue);

        var result = a + element;

        return result;
    }, 0);

    return result;
};

function GetDescendantProp(obj, propertyPath) {
    var arr = propertyPath.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function RemoveIngredient(scope, currentIngredient) {
    var elementKey = currentIngredient.key;
    var recipeIngredients = scope.recipeIngredients;

    var elementIndex = recipeIngredients.map(function (e) { return e.key; }).indexOf(elementKey);
    recipeIngredients.splice(elementIndex, 1);

}





