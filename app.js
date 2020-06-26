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
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        precentage:-1
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
        },
        calculateBudget:function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc>0){
                data.precentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else{
                data.precentage = -1
            }
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.precentage
            }
        },
        deleteItem:function(type,id){
            var ids, index;
            ids = data.allItems[type].map(function(curr){
               return curr.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        }
    }
})();
///////////////////////////////////////////////////
var uiController = (function(){
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container'
    };
    return {
        getInput: function(){
            return{
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },
        addListItem: function(obj,type){
        var html,newHtml,element;
            if(type === 'inc'){
                element = domStrings.incomeContainer;
                html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp'){
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        getDOMstrings:function(){
            return domStrings;
        },
        clearFields:function(){
            var fields,fieldsArray;
            fields = document.querySelectorAll(domStrings.inputDescription + ', '+domStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        displayBudget:function(obj){
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            if(obj.percentage>0){
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(domStrings.percentageLabel).textContent = '---';

            }
        },
        deleteListItem:function(selectorID){
            var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    var updateBudget = function(){
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budget);
        console.log(budget);
    };
    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type,ID);
            uiCtrl.deleteListItem(itemID);
            updateBudget();
        }
    };
    var ctrlAddItem = function(){
        var input,newItem;
        input = uiCtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type,input.description,input.value); 
            uiCtrl.addListItem(newItem,input.type);
            updateBudget();
            uiCtrl.clearFields();
        }
    };

    return {
        init:function(){
            uiCtrl.displayBudget( {
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0
            });
            setupEventListeners();
        }
    }
})(uiController,budgetController);
appController.init();
