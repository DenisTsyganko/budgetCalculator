'use strict';
let startBtn = document.getElementById('start'),
    budgetValue = document.getElementsByClassName('budget-value')[0],
    dayBudgetValue = document.getElementsByClassName('daybudget-value')[0],
    level = document.getElementsByClassName('level-value')[0],
    expenses = document.getElementsByClassName('expenses-value')[0],
    optExpenses = document.getElementsByClassName('optionalexpenses-value')[0],
    income = document.getElementsByClassName('income-value')[0],
    monthSavings = document.getElementsByClassName('monthsavings-value')[0],
    yearSavings = document.getElementsByClassName('yearsavings-value')[0],
    expensesInput = document.querySelectorAll('.expenses-item'),
    expensesBtn = document.getElementsByClassName('expenses-item-btn')[0],
    optExpensesBtn = document.getElementsByClassName('optionalexpenses-btn')[0],
    countBudgetBtn = document.getElementsByClassName('count-budget-btn')[0],
    optExpensesInput = document.querySelectorAll('.optionalexpenses-item'),
    incomeInput = document.querySelector('#income'),
    savingsCheckbox = document.querySelector('#savings'),
    savingsAmmount = document.querySelector('#sum'),
    savingsPercent = document.querySelector('#percent'),
    yearValue = document.querySelector('.year-value'),
    monthValue = document.querySelector('.month-value'),
    dayValue = document.querySelector('.day-value'),
    savingsLabels = document.querySelectorAll('label');

let money, time;
let appData = {
    budget : money,
    timeData : time,
    expenses : {},
    optionalExpenses : {},  
    income : [],
    savings : false
};

expensesBtn.disabled = true;
optExpensesBtn.disabled = true;
savingsCheckbox.disabled = true;
countBudgetBtn.disabled = true;
savingsAmmount.style.visibility = "hidden";
savingsPercent.style.visibility = "hidden";
savingsLabels[0].style.visibility = "hidden";
savingsLabels[1].style.visibility = "hidden";

let inputFields = [];
for (let i = 0; i < expensesInput.length; i++){
    inputFields.push(expensesInput[i]);
}
optExpensesInput.forEach(function(item){
    inputFields.push(item);
});
inputFields.push(incomeInput);

inputFields.forEach(function(element){
    element.addEventListener('input',function(){
        if (!appData.budget){
            budgetValue.textContent = "Начните расчет";
        }
    });
});

startBtn.addEventListener('click',function(){
    money = +prompt("Ваш бюджет на месяц?");
    if (isNaN(money) || money == '' || money == null) {
        alert("Введите корректные данные!");
        return;
    }

    time = prompt("Введите дату в формате YYYY-MM-DD");
    let reg = /\d\d\d\d-\d\d-\d\d/g;
    if (!time.match(reg)){
        alert("Введите корректные данные!");
        return;
    }
    expensesBtn.disabled = false;
    optExpensesBtn.disabled = false;
    savingsCheckbox.disabled = false;
    countBudgetBtn.disabled = false;

    appData.budget = money;
    appData.time = time;
    budgetValue.textContent = money.toFixed();
    yearValue.value = new Date(Date.parse(time)).getFullYear();
    monthValue.value = new Date(Date.parse(time)).getMonth() + 1;
    dayValue.value = new Date(Date.parse(time)).getDate();

});

expensesBtn.addEventListener('click',function(){
    let sum = 0 ;
    for (let i = 0; i < expensesInput.length; i++){
        let a = expensesInput[i].value,
            b = expensesInput[++i].value;
        if (isNaN(+b)){
            expenses.textContent = 'Введите корректные данные';
            return;
        }

        appData.expenses[a] = b;
        sum += +b;
    }
    expenses.textContent = sum;
});

optExpensesBtn.addEventListener('click',function(){
    for (let i = 0; i < optExpensesInput.length; i++){
        let a = optExpensesInput[i].value;

        appData.optionalExpenses[i] = a;
    }
    
    let optExpensesValue = '';
    for (const [key, value] of Object.entries(appData.optionalExpenses)){
        optExpensesValue += value;
        if (appData.optionalExpenses[+key + 1]){ optExpensesValue += ', ';}
    }

    optExpenses.textContent = optExpensesValue;
});

countBudgetBtn.addEventListener('click',function(){
    let expensesSum = 0;
    for (const [key, value] of Object.entries(appData.expenses)){
        expensesSum += +value;
    }
    appData.dailyBudget = Math.round((appData.budget - expensesSum) / 30);
    dayBudgetValue.textContent = appData.dailyBudget;

    if(appData.dailyBudget < 100){
        level.textContent = "Низкий доход";
    } else if (appData.dailyBudget >= 100 && appData.dailyBudget < 2000){
        level.textContent = "Нормальный доход";
    } else if (appData.dailyBudget > 2000){
        level.textContent = "Высокий доход";
    } else {
        level.textContent = "Some error occured!";
    }

});

incomeInput.addEventListener('input',function(){
    let items = incomeInput.value;
    appData.income = items.split(',');
    income.textContent = appData.income;
});

savingsCheckbox.addEventListener('click',function(){
    if (appData.savings){
        appData.savings = false;
        savingsAmmount.style.visibility = "hidden";
        savingsPercent.style.visibility = "hidden";
        savingsLabels[0].style.visibility = "hidden";
        savingsLabels[1].style.visibility = "hidden";
    } else {
        appData.savings = true;
        savingsAmmount.style.visibility = "visible";
        savingsPercent.style.visibility = "visible";
        savingsLabels[0].style.visibility = "visible";
        savingsLabels[1].style.visibility = "visible";
    }
});

savingsAmmount.addEventListener('input', function(){
    if(isNaN(+savingsAmmount.value)){
        monthSavings.textContent = yearSavings.textContent = 'Введите корректные данные';
        return;
    }
    if (!savingsPercent.value || isNaN(savingsPercent.value)){
        monthSavings.textContent = yearSavings.textContent = 'Введите процент';
        return;
    } else{
        appData.monthIncome = Math.round(savingsAmmount.value/100/12*savingsPercent.value);
        monthSavings.textContent = appData.monthIncome;
        yearSavings.textContent = +appData.monthIncome * 12;
    }
});

savingsPercent.addEventListener('input', function(){
    if(isNaN(+savingsPercent.value)){
        monthSavings.textContent = yearSavings.textContent = 'Введите корректные данные';
        return;
    }
    if (!savingsAmmount.value || isNaN(savingsAmmount.value)){
        monthSavings.textContent = yearSavings.textContent = 'Введите процент';
        return;
    } else{
        appData.monthIncome = Math.round(savingsAmmount.value/100/12*savingsPercent.value);
        monthSavings.textContent = appData.monthIncome;
        yearSavings.textContent = +appData.monthIncome * 12;
    }
});








