///////////////////////////////////////////////////
var budgetController = (function(){
})();
///////////////////////////////////////////////////
var uiController = (function(){
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'

    };
    return {
        getInput: function(){
            return{
        inputType: '.add__type',
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            };
        },
        getDOMstrings:function(){
            return domStrings;
        }
    };
})();
///////////////////////////////////////////////////
var appController = (function(uiCtrl,budgetCtrl){
    var DOM = uiCtrl.getDOMstrings();
    console.log(DOM);
    var ctrlAddItem = function(){
        var input = uiCtrl.getInput();
        console.log(input);



    };
    document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){
        if(event.which === 13){ctrlAddItem();}
    });
})(uiController,budgetController);
