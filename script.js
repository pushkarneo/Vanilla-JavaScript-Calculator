class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.bits = bits
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
    for (let i = 0; i < this.bits.length; i++) {
      this.bits[i].innerText = '0';
    }
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  resetOnes(){
    for(let i = 0 ; i < 53;i++){
      this.bits[this.bits.length - i - 1].innerText = '1'
    }
    // this.bits.forEach(function (e) {
    //   e.innerText = '1';
    // })
    this.computeNumber()
  }

  updateBits(number) {
    let intnumber = parseInt(number)
    if (isNaN(intnumber)){
      this.bits.forEach(function (e) {
            e.innerText = '0';
        })
      return;
    }
    let i = this.bits.length
    // console.log(intnumber);
    while(intnumber !== 0){
      this.bits[i - 1].innerText = (intnumber % 2).toString();
      // console.log(intnumber)
      intnumber = Math.floor(intnumber / 2);
      i = i - 1;
    }
  }

  computeNumber(){
    let number = 0;
    for(let i = this.bits.length - 1; i >= 0 ; i--){
      number = number + parseInt(this.bits[i].innerText)*Math.pow(2,this.bits.length - i - 1);
    }
    // console.log(number);
    this.currentOperand = number.toString()
  }

  flipbit(i){
    // console.log(i);
    let ithnumber = parseInt(this.bits[i].innerText);
    // console.log(ithnumber);
    if(ithnumber === 1){
      this.bits[i].innerText = '0';
    } else {
      this.bits[i].innerText = '1';
    }
    this.computeNumber();
  }

  updateCurrentOperand(){
    let displaynumber = this.currentOperandTextElement.innerText
    // console.log(displaynumber)
    if(displaynumber.includes(',')){
      displaynumber = displaynumber.split(',').join('')
    }
    this.currentOperand = parseFloat(displaynumber)
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    this.updateBits(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const bits = document.querySelectorAll('[bit]')
const resetOnes = document.querySelector('[reset-one]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})

for(let i = 0; i < bits.length; i++){
  bits[i].addEventListener('click', button => {
    calculator.flipbit(i)
    calculator.updateDisplay()
  })
}

resetOnes.addEventListener('click', button => {
  calculator.resetOnes()
  calculator.updateDisplay()
})

currentOperandTextElement.addEventListener('input', Element => {
  calculator.updateCurrentOperand()
  calculator.updateDisplay()
})