
var app = angular.module('recipeApp', []);


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

app.service('ingredientsSvc', function () {
    return [
        { key: "default", value: "Please select an ingredient..." },
        { key: "whiteFlour", value: "White flour", carbs: { total: 71.2, sugars: 1.8 }, fats: { total: 2.2, saturated: 1.4 }, fibre: 2.9, proteins: 10.5, salt: 0 },
        { key: "erythritol", value: "Erythritol", carbs: { total: 0, sugars: 0 }, fats: { total: 0, saturated: 0 }, fibre: 0, proteins: 0, salt: 0 },
        { key: "egg", value: "Eggs", fats: { total: 9.6, saturated: 2.7 }, carbs: { total: 0.25, sugars: 0.25 }, proteins: 14.1, fibre: 0.25, salt: 0.38 },
        { key: "milk", value: "Milk", fats: { total: 3.6, saturated: 2.3 }, carbs: { total: 4.6, sugars: 4.6 }, proteins: 3.4, fibre: 0.25, salt: 0.11 },
        { key: "mascarpone", value: "Mascarpone", fats: { total: 42, saturated: 30.4 }, carbs: { total: 4.9, sugars: 4.6 }, proteins: 3.6, fibre: 0, salt: 0.13 },
        { key: "activeYeast", value: "Active yeast", fats: { total: 3.8, saturated: 1.3 }, carbs: { total: 16.9, sugars: 0.25 }, proteins: 44.5, fibre: 19.2, salt: 0.35 },
        { key: "bakingPowder", value: "Baking powder", fats: { total: 0, saturated: 0 }, carbs: { total: 28, sugars: 0 }, proteins: 0, fibre: 0.2, salt: 0 },
        { key: "rapeseedAndButter", value: "Butter with rapeseed", fats: { total: 77, saturated: 31 }, carbs: { total: 0.25, sugars: 0.25 }, proteins: 0.25, fibre: 0, salt: 1.1 },
        { key: "oatsFlour", value: "Oatmeal flour", fats: { total: 8.4, saturated: 1.3 }, carbs: { total: 56.1, sugars: 1 }, proteins: 12.1, fibre: 9.1, salt: 0 },
        { key: "speltFlour", value: "Spelt flour", fats: { total: 2.5, saturated: 0.4 }, carbs: { total: 63.6, sugars: 1.3 }, proteins: 13.3, fibre: 8.5, salt: 0.03 },
        { key: "beefMince20", value: "Beef mince 20%", fats: { total: 19.4, saturated: 8.5 }, carbs: { total: 0.8, sugars: 0.25 }, proteins: 23.7, fibre: 0.25, salt: 0.3 },
        { key: "evoOliveOil", value: "Evo olive oil", fats: { total: 13.7, saturated: 2.0 }, carbs: { total: 0, sugars: 0 }, proteins: 0, fibre: 0, salt: 0 },
        { key: "parmigianoReggiano", value: "Parmigiano Reggiano cheese", fats: { total: 28.4, saturated: 18.7 }, carbs: { total: 0.25, sugars: 0.25 }, proteins: 33, fibre: 0.25, salt: 1.63 },
        { key: "tomatoPassata", value: "Tomato passata", fats: { total: 0.25, saturated: 0.1 }, carbs: { total: 6, sugars: 4.7 }, proteins: 1.1, fibre: 0.8, salt: 0.43 },
        { key: "cocoaPowder", value: "Cocoa powder", fats: { total: 21.5, saturated: 15.5 }, carbs: { total: 14, sugars: 2 }, proteins: 23, fibre: 33.5, salt: 1.4 },
        { key: "sugarFreeChocolate", value: "Sugar free chocolate", fats: { total: 42.2, saturated: 26.9 }, carbs: { total: 7.5, sugars: 1.2 }, proteins: 8.2, fibre: 11, salt: 0.03 },
        { key: "ricotta", value: "Ricotta", fats: { total: 10.1, saturated: 6.3 }, carbs: { total: 3.5, sugars: 3.2 }, proteins: 7, fibre: 0, salt: 0.41 },
        { key: "doubleCream", value: "Double cream", fats: { total: 47.5, saturated: 29.7 }, carbs: { total: 2.6, sugars: 2.6 }, proteins: 1.7, fibre: 0, salt: 0.01 },
        { key: "digestiveBiscuits", value: "Digestive biscuits", fats: { total: 18.3, saturated: 8.6 }, carbs: { total: 66.9, sugars: 18.9 }, proteins: 7.1, fibre: 3.8, salt: 1.03 },
        { key: "digestiveBiscuitsDark", value: "Digestive biscuits dark chocolate", fats: { total: 23.3, saturated: 11.8 }, carbs: { total: 63.9, sugars: 24.1 }, proteins: 6.7, fibre: 3.4, salt: 0.78 }
    ];
});

app.service('recipeTotalsSvc', function () {
    var recipeTotals = {
        carbsTotal: 0,
        sugarsTotal: 0,
        fatsTotal: 0,
        satFatsTotal: 0,
        fibreTotal: 0,
        proteinsTotal: 0,
        saltTotal: 0
    };

    return {
        set: set,
        get: get
    }

    function get() {
        return recipeTotals;
    }

    function set(value) {
        recipeTotals = value;
    }
});

app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        var result;
        if (input) {
            result = $filter('number')(input, decimals) + '%';
        }
        return result;
    };
}]);





