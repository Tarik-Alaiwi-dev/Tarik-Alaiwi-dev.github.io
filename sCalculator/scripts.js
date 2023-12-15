let operation = "";
let evaluated = 0;
const operations = document.querySelector(".operations-p");
const quickResult = document.querySelector(".quick-result-p");
console.log(operations.textContent);

function ifOccurs(operation, char){
    for(let i=0; i<operation.length; i++){
        if(operation[i] === char){;
            return 1;
        }
    }
    return 0;
}

function generate(){
    operations.textContent = operation;
    quickResult.textContent = eval(operation);
    document.querySelector('.operations-p').classList.remove('green');
}

function addOperation(num){
    operation += num.toString();
    generate();
}

function result(){
    let tmp = eval(operation);
    if(Number.isInteger(tmp)){
        operation = tmp;
    }else{
        operation = tmp.toFixed(2);
    }
    generate();
    document.querySelector('.operations-p').classList.add('green');
}

function clean(){
    operation = "";
    generate();
}

function remove(){
    operation = operations.textContent;
    operation = operation.slice(0, -1);
    generate();
}

function dot(){
    console.log(operations.textContent !== '');
    if(operations.textContent.includes('.')){
        return;
    }
    if(operations.textContent === ''){
        operation += '0.';
    }else if(operations.textContent !== '' && !operations.textContent.includes('.')){
        operation += '.';
    }
    generate();
}

function percent(){
    operation = operations.textContent;
    operation *= 0.01;
    generate();
}

function sqrt(){
    operation = operations.textContent;
    operation = Math.sqrt(operation).toFixed(2);
    generate();
}

function parentheses(){
    operation = operations.textContent;
    if(ifOccurs(operation, ')')){
        return;
    }
    if(ifOccurs(operation, '(')===1){
        operation += ')';
    }else{
        operation += '(';
    }
    generate();
}

function opposite(){
    operation = operations.textContent;
    if(operation[0] === '-'){
        operation = operation.slice(1);
    }else{
        operation = '-' + operation;
    }
    generate();
}