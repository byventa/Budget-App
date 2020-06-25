///////////////////////////////////////////////////
var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    };
    return {
        addItem:function(type,des,val){
            var newItem,ID;
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else{
                ID = 0;
            }
            if(type === 'exp'){
                newItem = new Expense(ID,des,val)
            } else if (type === 'inc'){
                newItem = new Income(ID,des,val)
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing:function(){
            console.log(data);
        }
    }
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

    var setupEventListeners = function(){
        var DOM = uiCtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.which === 13){ctrlAddItem();}
        });
    };

    var ctrlAddItem = function(){
        var input,newItem;
        input = uiCtrl.getInput();
        newItem = budgetCtrl.addItem(input.type,input.description,input.value); 
        console.log(input);
        console.log(newItem);
    };

    return {
        init:function(){
            console.log('app started');
            setupEventListeners();
        }
    }
})(uiController,budgetController);
appController.init();