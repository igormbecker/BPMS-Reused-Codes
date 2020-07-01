$(document).ready(function () {
    BpmForm.Init();
    controlSelectionFromTable('tblDespesa', 'inpTB_CATEGORIA', "Selecione" );
});

////////////
// Objetivo - Essa função realiza o controle das opções do select contido em uma tabela 
//            multivalorada não permitido que o usuario selecione a mesma opção em varias linhas
//
// Como usar - Inserir a chamada no ready ou load de uma pagina
//             $(document).ready(function () {
//                  controlSelectionFromTable('tblDespesa', 'inpTB_TIPO', 'Selecione');
//             }
// Parametros:
//      idTable - Informar o id da tabela multivalorada
//      xnameSelector - Informar o xname do select 
//      itenIgnore - Informar o text de algum option que deve ser ignorado na validação
////////////

function controlSelectionFromTable(idTable, xnameSelector, itenIgnore) {
    var objTable = document.getElementById(idTable)
    const listOptions = [];
    var listSelector = objTable.querySelector('[xname="' + xnameSelector + '"]');

    const rearrange = (objTable, xnameSelector, listOption, itenIgnore) => {
        var i;
        const listRowSelected = [];
         //Carrega os itens selecionados
        Array.from(objTable.rows).forEach(row => {
            var objSelectValue = row.querySelector('[xname="' + xnameSelector + '"]')
            if (objSelectValue != null) {
                var optSelected = objSelectValue.options[objSelectValue.selectedIndex];
                if (optSelected.text != itenIgnore)
                    listRowSelected.push(optSelected);
            }
        })

      
        Array.from(objTable.rows).forEach(row => {

            const objSelect = row.querySelector('[xname="' + xnameSelector + '"]')
            if (objSelect != null) {
                //Excluir os itens já selecionados
                const optSelected = objSelect.options[objSelect.selectedIndex];
                Array.from(objSelect).forEach(option => {
                    if (listRowSelected.filter(item => option.text == item.text).length > 0 && !option.selected) {
                        option.remove()
                    }
                })
                
                //Incluir os itens disponiveis
                Array.from(listOption).forEach(option => {
                    if (Array.from(objSelect).filter(item => option.text == item.text).length == 0 &&
                        listRowSelected.filter(item => option.text == item.text).length == 0){
                        objSelect.appendChild(new Option(option.value, option.text))
                    }
                        
                })

                // Delegate para ação de excluir a linha
                const objRemove = row.querySelector('[onclick="DeleteRow(this)"]')
                objRemove.addEventListener('click', () => {
                    rearrange(objTable, xnameSelector, listOption, itenIgnore);
                })

                // Delegate para alteração de valor
                const selector = row.querySelector('[xname="' + xnameSelector + '"]');
                selector.addEventListener('change', () => {
                    rearrange(objTable, xnameSelector, listOption, itenIgnore);
                })
            }
        })

    }

    // Recolher as opções iniciais da combo
    if (listSelector.constructor.name == "HTMLSelectElement") {
        Array.from(listSelector).forEach(option => listOptions.push(option))
    }

    // Delegate para inclusão de linha
    var buttonAddLine = objTable.querySelector('[id="BtnInsertNewRow"]')
    buttonAddLine.addEventListener('click', () => {
        rearrange(objTable, xnameSelector, listOptions, itenIgnore);
    })

    //Primeira execução
    rearrange(objTable, xnameSelector, listOptions, itenIgnore);

}


////////////
// Objetivo - Essa função realiza o congelamento a partir do parametro itenFreeze  
////////////

function controlSelectedFreeze(idTable, xnameSelector, itenFreeze, itenIgnore) {
    var objTable = document.getElementById(idTable)
    const listOptions = [];
    var listSelector = objTable.querySelector('[xname="' + xnameSelector + '"]');

    const rearrange = (objTable, xnameSelector, listOption, itenFreeze, itenIgnore) => {
        var i;
        const listRowSelected = [];
        //Carrega os itens selecionados
        Array.from(objTable.rows).forEach(row => {
            var objSelectValue = row.querySelector('[xname="' + xnameSelector + '"]')
            if (objSelectValue != null) {
                var optSelected = objSelectValue.options[objSelectValue.selectedIndex];
                if (optSelected.text != itenIgnore)
                    listRowSelected.push(optSelected);
            }
        })


        Array.from(objTable.rows).forEach(row => {

            const objSelect = row.querySelector('[xname="' + xnameSelector + '"]')
            if (objSelect != null) {
                const optSelected = objSelect.options[objSelect.selectedIndex];
                Array.from(objSelect).forEach(option => {
                    if (listRowSelected.length > 0 && listRowSelected.filter(item => item.text == itenFreeze).length > 0 && option.text != "Reembolso de internet" && option.text != itenIgnore) {
                        option.remove()
                    } else if (listRowSelected.length > 0 && listRowSelected.filter(item => item.text != itenFreeze).length > 0 && option.text == "Reembolso de internet") {
                        option.remove()
                    }
                })

                if (Array.from(objTable.rows).length == 2 && optSelected.text == itenIgnore) {
                    Array.from(objSelect).forEach(option => option.remove())
                    Array.from(listOption).forEach(option => {
                        objSelect.add(option)
                    })
                    objSelect.selectedIndex = 0
                }

                // Delegate para ação de excluir a linha
                const objRemove = row.querySelector('[onclick="DeleteRow(this)"]')
                objRemove.addEventListener('click', () => {
                    rearrange(objTable, xnameSelector, listOption, itenFreeze, itenIgnore);
                })

                // Delegate para alteração de valor
                const selector = row.querySelector('[xname="' + xnameSelector + '"]');
                selector.addEventListener('change', () => {
                    rearrange(objTable, xnameSelector, listOption, itenFreeze, itenIgnore);
                })
            }
        })

    }

    // Recolher as opções iniciais da combo
    if (listSelector.constructor.name == "HTMLSelectElement") {
        Array.from(listSelector).forEach(option => listOptions.push(option))
    }

    // Delegate para inclusão de linha
    var buttonAddLine = objTable.querySelector('[id="BtnInsertNewRow"]')
    buttonAddLine.addEventListener('click', () => {
        rearrange(objTable, xnameSelector, listOptions, itenFreeze, itenIgnore);
    })

    //Primeira execução
    rearrange(objTable, xnameSelector, listOptions, itenFreeze, itenIgnore);

}