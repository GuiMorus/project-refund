// Conectando o DOM
const form = document.querySelector('form')
const expense = document.querySelector('#expense')
const category = document.querySelector('#category')
const amount = document.querySelector('#amount')
const list = document.querySelector('ul')
const spanExpense = document.querySelector('header span')
const totalExpense = document.querySelector('header h2')

// Iniciando variaveis
let total = 0

// Trabalhando com FORM
form.onsubmit = (event) => {
    event.preventDefault()                                          // Evitando que a página recarregue

    const newExpense = {                                            // Objeto para centralizar as informações
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date().toLocaleString()
    }

    let valor = convertNumber(newExpense.amount)                    // Convertendo AMOUNT do newExpense em NUMBER
    updateTotal(valor)                                              // Atualizando Total
    expenseAdd(newExpense)                                          // Passando OBJ para a função
}

// Trabalhando com INPUT: Valor da Despesa
amount.addEventListener('input', (event) =>{
    // Obtendo valor do input para substituir por caracteres não numéricos
    let value = amount.value.replace(/\D+/g, "")                    // RegEx de letras
    value = Number(value) / 100                                     // Transformando o valor em número e para centavos
    amount.value = formatBRL(value)                                 // Atualiza o valor do input
})

// Trabalhando com a remoção de um item da lista
list.addEventListener("click", (event) =>{
    if(event.target.classList.contains("remove-icon")){
        const item = event.target.closest(".expense")               // Obtendo o elemento pai do elemento clicado
        const valor = event.target.previousElementSibling           // Obtendo o elemento vizinho anterior

        item.remove()                                               // Removendo Item
        updateTotal(convertNumber(valor.textContent) * -1)          // Atualizando valor total
        updateCount()                                               // Atualizando número e total de despesas
    }
})


// Função para formatar para o padrão BRL
function formatBRL(value){
    value = value.toLocaleString('pt-BR',
        {
            style: "currency",
            currency: "BRL"
        })
    
    return value
}

// Função para adicionar item
function expenseAdd(despesa){
    try{
        // Cria o LI para adicionar na lista
        const item = document.createElement('li')
        item.classList.add('expense')

        // Cria a IMG para adicionar na LI
        const img = document.createElement('img')
        img.src = `./img/${despesa.category_id}.svg`                // Adicionando src da IMG
        img.alt = "Ícone de tipo de despesa"                        // Adicionando alt da IMG

        // Cria a DIV para adicionar na LI
        const div = document.createElement('div')
        const divStrong = document.createElement('strong')          // STRONG dentro da DIV
        const divSpan = document.createElement('span')              // SPAN dentro da DIV
    
        divStrong.textContent = `${despesa.expense}`                // Adicionando texto dentro da STRONG da DIV
        divSpan.textContent = `${despesa.category_name}`            // Adicionando texto dentro da SPAN da DIV

        div.classList.add('expense-info')                           // Montando DIV
        div.appendChild(divStrong)                                  // Colocando STRONG dentro da DIV
        div.appendChild(divSpan)                                    // Colocando SPAN dentro da DIV

        // cria o SPAN para adicionar na LI
        const span = document.createElement('span')
        const smallSpan = document.createElement('small')

        smallSpan.textContent = "R$"                                // Adicionando texto dentro do SMALL da SPAN
        span.classList.add('expense-amount')                        // Adicionando classe a SPAN
        span.append(smallSpan, String(despesa.amount).replace("R$", ""))    // Adicionando conteúdos dentro da SPAN

        // Cria a IMG que será o remove na LI
        const remove = document.createElement('img')
        remove.classList.add('remove-icon')                           // Adicionando classe dentro da IMG de Icone
        remove.src = "./img/remove.svg"                               // Adicionando src dentro da IMG de Icone
        remove.alt = "remover"                                        // Adicionando alt dentro da IMG de Icone

        // Montando LI dentro da LISTA
        item.append(img, div, span, remove)
        list.appendChild(item)

        
        updateCount()                                                  // Atualizando número e total de despesas
        formClear()                                                    // Limpa o formulário

    }catch(error){
        console.log(error)
        alert("Não foi possível atualizar a lista de despesas")
    }
}

// Função para atualizar o SPAN de número de despesas do ASIDE
function updateCount(){
    spanExpense.textContent = `${list.childElementCount} ${list.childElementCount > 1? "despesas" : "despesa"}`
    totalExpense.innerHTML = `<small>R$</small>${total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

// Atualizando o valor total das dividas
function updateTotal(value){
    let valor = Number(value)
    total += valor
}

// Converte o toLocaleString para Number
function convertNumber(number){
    return Number(number.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
}

// Limpar os inputs ao adicionar um item
function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
    expense.focus()
}
