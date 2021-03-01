window.addEventListener("load", function () {

    //Utilizado para pegar o apelido da tarefa atual.
    var task = document.getElementById('inpDsFlowElementAlias').value;

    sml_RulesOfPageLoadByTask(task);

});

/*
 * Desenvolvedor: Igor Becker
Realiza as Regras da Página apos carregamento do formulario
@PARAM: @task = Apelido da tarefa.
Ex de chamada: sml_RulesOfPageLoadByTask(document.getElementById('inpDsFlowElementAlias').value);
*/
function sml_RulesOfPageLoadByTask(task) {
    var tablesToHide;
    var fieldsToHide;

    switch (task.toUpperCase()) {

        case "START":
            tablesToHide = `Endereço`;
            fieldsToHide = `comprovanteDeResidencia`;

            sml_HideTables(tablesToHide);
            sml_Hide(fieldsToHide);
            sml_ShowOrHideSelectOptions("opcoes", "Opção 1,Opção 2", "HIDE", false, "");
            sml_ShowOrHideSelectOptions("maiorDe18", "Não", "HIDE", true, "tblColaboradores");
            sml_addFunctionOnInsertAndDeleteTableValue('tblColaboradores');
            //sml_getUserByCpf('146.161.654-91');
            break;

        default:
            break;

    }

}

/*
 * Desenvolvedor: Igor Becker
Esconde uma tabela/agrupamento inteiro, desobriga seus campos e limpa o valor se necessário.
Guarda se os campos da tabela são obrigatórios em um novo atributo "data-required";
@PARAM: @ids = identificador da tabela/tabelas.
@PARAM: @clean = true/false.
Ex de chamada: sml_HideTables('tblRepresentante,Dados da Solicitacao', false);
*/
function sml_HideTables(tableIds, clean) {
    clean = clean || false;

    function hideTablesProcess(id, clean) {
        var i = 0;
        var tbl = document.getElementById(id);

        if (tbl) {
            tbl.style.display = "none";

            if (clean) {
                if (tbl.getAttribute("mult") == "S") {
                    //Apaga as linhas da tabela exceto a primeira.
                    Array.from(tbl.tBodies[0].rows).forEach(row => {
                        if (i > 1)
                            execv2.form.multipletable.deleteRow(row.querySelector('[id="btnDeletewRow"]'));

                        i++;
                    });

                }
                //Apaga os valores dos campos dentro da tabela.
                Array.from(tbl.tBodies[0].rows).forEach(row => {
                    var inputs = row.querySelectorAll('input');
                    var selects = row.querySelectorAll('select');
                    var textareas = row.querySelectorAll('textarea');

                    //Apaga os valores dos inputs
                    if (inputs.length > 0) {
                        Array.from(inputs).forEach(obj => {
                            var type = obj.getAttribute("type");
                            var xtype = obj.getAttribute("xtype");

                            //Se o elemento for diferente de botão ou hidden
                            if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {

                                if (type.toUpperCase() == "TEXT")
                                    obj.value = '';

                                if (type.toUpperCase() == "RADIO" || type.toUpperCase() == "CHECKBOX")
                                    obj.checked = false;

                                if (xtype && xtype.toUpperCase() == "FILE") {
                                    var btnDelFile = row.querySelector("[title='Excluir']");

                                    if (btnDelFile)
                                        btnDelFile.click();
                                }
                            }

                        });
                    }
                    //Faz as regras para os selects
                    if (selects.length > 0) {
                        Array.from(selects).forEach(obj => {
                            obj.value = '';
                        });
                    }
                    //Faz as regras para os textareas
                    if (textareas.length > 0) {
                        Array.from(textareas).forEach(obj => {
                            obj.value = '';
                        });
                    }
                });
            }

            //Remove obrigatoriedade dos campos
            Array.from(tbl.tBodies[0].rows).forEach(row => {
                var inputs = row.querySelectorAll('input');
                var selects = row.querySelectorAll('select');
                var textareas = row.querySelectorAll('textarea');
                var isrequired = '';

                //Faz as regras para os inputs
                if (inputs.length > 0) {
                    Array.from(inputs).forEach(obj => {
                        var type = obj.getAttribute("type");
                        isrequired =
                            (
                                (obj.getAttribute("data-required") != null && obj.getAttribute("data-required") == "true") ||
                                (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                            ) ? true : false;

                        //Se o elemento for diferente de botão ou hidden
                        if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {
                            obj.setAttribute("data-required", isrequired);
                            obj.setAttribute("required", "N");
                        }

                    });
                }
                //Faz as regras para os selects
                if (selects.length > 0) {
                    Array.from(selects).forEach(obj => {
                        isrequired =
                            (
                                (obj.getAttribute("data-required") != null && obj.getAttribute("data-required") == "true") ||
                                (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                            ) ? true : false;

                        obj.setAttribute("data-required", isrequired);
                        obj.setAttribute("required", "N");
                    });
                }
                //Faz as regras para os textareas
                if (textareas.length > 0) {
                    Array.from(textareas).forEach(obj => {
                        isrequired =
                            (
                                (obj.getAttribute("data-required") != null && obj.getAttribute("data-required") == "true") ||
                                (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                            ) ? true : false;

                        obj.setAttribute("data-required", isrequired);
                        obj.setAttribute("required", "N");
                    });
                }
                //Faz as regras para as linhas
                if (row.getAttribute("class") != "group" && tbl.getAttribute("mult") != "S")
                    row.setAttribute("class", "");

            });

        }

    }

    if (tableIds != "") {
        if (tableIds.indexOf(',') >= 0) {
            var arrayIds = tableIds.split(',');

            Array.from(arrayIds).forEach(id => {
                hideTablesProcess(id.trim(), clean);
            });

        } else {
            hideTablesProcess(tableIds.trim(), clean);
        }
    }

}

/*
 * Desenvolvedor: Igor Becker
Mostra uma tabela/agrupamento inteiro e obriga seus campos se eles forem obrigatórios.
Resgata se os campos da tabela são obrigatórios em um novo atributo "data-required";
@PARAM: @ids = identificador da tabela/tabelas.
@PARAM: @clean = true/false.
Ex de chamada: sml_ShowTables('tblRepresentante,Dados da Solicitacao');
*/
function sml_ShowTables(tableIds) {

    function showTablesProcess(id) {
        var i = 0;
        var tbl = document.getElementById(id);

        if (tbl) {

            tbl.style.display = "";

            //Faz as regras de obrigatoriedade para cada campo da tabela
            Array.from(tbl.tBodies[0].rows).forEach(row => {
                var inputs = row.querySelectorAll('input');
                var selects = row.querySelectorAll('select');
                var textareas = row.querySelectorAll('textarea');
                var wasrequired = '';

                //Faz as regras para os inputs
                if (inputs.length > 0) {
                    Array.from(inputs).forEach(obj => {
                        var type = obj.getAttribute("type");
                        wasrequired = obj.getAttribute("data-required");

                        //Se o elemento for diferente de botão ou hidden
                        if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {
                            if (wasrequired != null && wasrequired == "true")
                                obj.setAttribute("required", "S");
                        }

                    });
                }
                //Faz as regras para os selects
                if (selects.length > 0) {
                    Array.from(selects).forEach(obj => {
                        wasrequired = obj.getAttribute("data-required");

                        if (wasrequired != null && wasrequired == "true")
                            obj.setAttribute("required", "S");
                    });
                }
                //Faz as regras para os selects
                if (textareas.length > 0) {
                    Array.from(textareas).forEach(obj => {
                        wasrequired = obj.getAttribute("data-required");

                        if (wasrequired != null && wasrequired == "true")
                            obj.setAttribute("required", "S");
                    });
                }
                //Adiciona a classe obrigatorio na linha caso necessario
                if (row.getAttribute("class") != "group" && tbl.getAttribute("mult") != "S" && wasrequired == "true")
                    row.setAttribute('class', 'execute-required');

            });

        }

    }

    if (tableIds != "") {
        if (tableIds.indexOf(',') >= 0) {
            var arrayIds = tableIds.split(',');

            Array.from(arrayIds).forEach(id => {
                showTablesProcess(id.trim());
            });

        } else {
            showTablesProcess(tableIds.trim());
        }
    }
}

/*
 * Desenvolvedor: Igor Becker
Função responsável por esconder e desobrigar um campo.
Guarda se o campo é obrigatório em um atributo novo "xrequired".
@PARAM: @fieldID = identificador do campo/campos.
Ex de chamada: sml_Hide('nome,cpf');
*/
function sml_Hide(fieldID) {
    if (fieldID != "" && fieldID != null && fieldID != undefined) {
        var field;
        var radioOrCheckFields;
        var fieldType;
        var fieldXType;
        var tr;
        var td0;
        var td1;
        var isrequired;

        //Verifica se existe mais de 1 id
        if (fieldID.indexOf(",") >= 0) {
            var Ids = fieldID.replace(' ', '');
            var arrayIds = Ids.split(',');

            Array.from(arrayIds).forEach(id => {
                field = document.querySelector('[xname="inp' + id.trim() + '"]');
                fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
                fieldXType = field.getAttribute("xtype");
                tr = sml_Closest(field, "tr");
                td0 = document.getElementById(`td0${id.trim()}`);
                td1 = document.getElementById(`td1${id.trim()}`);
                isrequired =
                    (
                        (field.getAttribute("data-required") != null && field.getAttribute("data-required") == "true") ||
                        (field.getAttribute("required") != null && field.getAttribute("required") == "S")
                    ) ? true : false;

                //Guarda a obrigatoriedade no novo atributo.
                if (field.getAttribute('data-required') == undefined)
                    field.setAttribute('data-required', isrequired);

                if (fieldType != "hidden")
                    field.setAttribute('required', 'N');

                //Se o elemento for diferente de botão ou hidden
                if (fieldType && fieldType.toUpperCase() != "BUTTON" && fieldType.toUpperCase() != "HIDDEN") {

                    if (fieldType.toUpperCase() == "TEXT")
                        field.value = '';

                    if (fieldType.toUpperCase() == "SELECT" || fieldType.toUpperCase() == "SELECT-ONE")
                        field.value = '';

                    if (fieldType.toUpperCase() == "RADIO" || fieldType.toUpperCase() == "CHECKBOX") {
                        radioOrCheckFields = document.querySelectorAll('[xname="inp' + id.trim() + '"]');

                        Array.from(radioOrCheckFields).forEach(f => {
                            f.checked = false;
                        });
                    }

                    if (fieldType.toUpperCase() == "TEXTAREA")
                        field.value = '';

                    if (fieldXType && fieldXType.toUpperCase() == "FILE") {
                        var btnDelFile = tr.querySelector("[title='Excluir']");

                        if (btnDelFile)
                            btnDelFile.click();
                    }
                }

                if (fieldType.toUpperCase() == "HIDDEN") {
                    if (td0 && td1) {
                        td0.style.display = "none";
                        td1.style.display = "none";
                    }
                } else {
                    if (tr)
                        tr.style.display = "none";
                }

                if (tr && tr.getAttribute('class') != "group")
                    tr.setAttribute('class', '');

            });

        } else {

            field = document.querySelector('[xname="inp' + fieldID + '"]');
            fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
            fieldXType = field.getAttribute("xtype");
            tr = sml_Closest(field, "tr");
            td0 = document.getElementById(`td0${fieldID.trim()}`);
            td1 = document.getElementById(`td1${fieldID.trim()}`);
            isrequired =
                (
                    (field.getAttribute("data-required") != null && field.getAttribute("data-required") == "true") ||
                    (field.getAttribute("required") != null && field.getAttribute("required") == "S")
                ) ? true : false;

            //Guarda a obrigatoriedade no novo atributo.
            if (field.getAttribute('data-required') == undefined)
                field.setAttribute('data-required', isrequired);

            //Remove a obrigatoriedade do campo
            if (fieldType != "hidden")
                field.setAttribute('required', 'N');

            //Se o elemento for diferente de botão ou hidden
            if (fieldType && fieldType.toUpperCase() != "BUTTON" && fieldType.toUpperCase() != "HIDDEN") {

                if (fieldType.toUpperCase() == "TEXT")
                    field.value = '';

                if (fieldType.toUpperCase() == "SELECT" || fieldType.toUpperCase() == "SELECT-ONE")
                    field.value = '';

                if (fieldType.toUpperCase() == "RADIO" || fieldType.toUpperCase() == "CHECKBOX") {
                    radioOrCheckFields = document.querySelectorAll('[xname="inp' + id.trim() + '"]');

                    Array.from(radioOrCheckFields).forEach(f => {
                        f.checked = false;
                    });
                }

                if (fieldType.toUpperCase() == "TEXTAREA")
                    field.value = '';

                if (fieldXType && fieldXType.toUpperCase() == "FILE") {
                    var btnDelFile = tr.querySelector("[title='Excluir']");

                    if (btnDelFile)
                        btnDelFile.click();
                }
            }

            if (fieldType.toUpperCase() == "HIDDEN") {
                if (td0 && td1) {
                    td0.style.display = "none";
                    td1.style.display = "none";
                }
            } else {
                if (tr)
                    tr.style.display = "none";
            }

            if (tr && tr.getAttribute('class') != "group")
                tr.setAttribute('class', '');
        }
    }
}

/*
 * Desenvolvedor: Igor Becker
Função responsável por mostrar e obrigar o campo se ele for obrigatório.
Resgata se o campo é obrigatório atraves do atributo novo "xrequired".
@PARAM: @fieldID = identificador do campo/campos.
Ex de chamada: sml_Show('nome,cpf');
*/
function sml_Show(fieldID) {
    if (fieldID != "" && fieldID != null && fieldID != undefined) {
        var field;
        var fieldType;
        var tr;
        var td0;
        var td1;
        var isrequired;

        //Verifica se existe mais de 1 id
        if (fieldID.indexOf(",") >= 0) {
            var Ids = fieldID.replace(' ', '');
            var arrayIds = Ids.split(',');

            Array.from(arrayIds).forEach(id => {
                field = document.querySelector('[xname="inp' + id.trim() + '"]');
                fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
                tr = sml_Closest(field, "tr");
                td0 = document.getElementById(`td0${id.trim()}`);
                td1 = document.getElementById(`td1${id.trim()}`);
                isrequired = field.getAttribute("data-required");

                if (isrequired == "true" && fieldType.toUpperCase() != "HIDDEN")
                    field.setAttribute('required', 'S');

                if (fieldType.toUpperCase() == "HIDDEN") {
                    if (td0 && td1) {
                        td0.style.display = "";
                        td1.style.display = "";
                    }
                } else {
                    if (tr)
                        tr.style.display = "";
                }

                if (tr) {
                    if (isrequired == "true" && tr.getAttribute('class') != "group")
                        tr.setAttribute('class', 'execute-required');
                }

            });


        } else {

            field = document.querySelector('[xname="inp' + fieldID + '"]');
            fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
            tr = sml_Closest(field, "tr");
            td0 = document.getElementById(`td0${fieldID.trim()}`);
            td1 = document.getElementById(`td1${fieldID.trim()}`);
            isrequired = field.getAttribute("data-required");

            //Remove a obrigatoriedade do campo
            if (isrequired == "true" && fieldType.toUpperCase() != "HIDDEN")
                field.setAttribute('required', 'S');

            if (fieldType.toUpperCase() == "HIDDEN") {
                if (td0 && td1) {
                    td0.style.display = "";
                    td1.style.display = "";
                }
            } else {
                if (tr)
                    tr.style.display = "";
            }

            if (tr) {
                if (isrequired == "true" && tr.getAttribute('class') != "group")
                    tr.setAttribute('class', 'execute-required');
            }
        }
    }
}

/*
 * Desenvolvedor: Igor Becker
Função para retornar o elemento mais proximo de um objeto.
@PARAM: @obj = objeto.
@PARAM: @el = elemento a retornar.
Ex de chamada: sml_Closest(this, "tr");
*/
function sml_Closest(obj, el) {

    if (obj) {

        if (obj.nodeName == el.toUpperCase())
            return obj;
        else
            return sml_Closest(obj.parentElement, el);

    } else {
        return null;
    }

}

/*
Faz o append da mensagem no parent do campo (Função geralmente utilizada por funções que validam campos).
@PARAM: @Obj = OBJ DO CAMPO.
@PARAM: @message = MENSAGEM.
@PARAM: @idMessage = ID DA MENSAGEM.
@PARAM: @isValid = true/false.
Ex de chamada Cpf inválido: sml_appendMessageField(this, "CPF inválido!", "spanCpfMessage", false);
Ex de chamada Cpf válido: sml_appendMessageField(this, "", "spanCpfMessage", true);
*/
function sml_appendMessageField(Obj, message, idMessage, isValid) {
    var objOldMsg = document.getElementById(idMessage);
    var objNewMsg = document.createElement("span");
    objNewMsg.setAttribute("id", idMessage);

    //Verifica se existe mensagem de erro.
    if (message && idMessage) {
        objNewMsg.innerText = message;
        objNewMsg.style.fontWeight = "bold";
        objNewMsg.style.color = "red";
    }

    if (Obj.value == "") {
        Obj.style.border = "";

        if (objOldMsg)
            objOldMsg.remove();

    } else {
        if (isValid) {

            if (objOldMsg)
                objOldMsg.remove();

            Obj.style.border = "1px solid green";

        } else {

            if (objOldMsg)
                objOldMsg.remove();

            Obj.style.border = "1px solid red";
            Obj.parentElement.appendChild(objNewMsg);

        }
    }
}

/*
Valida o CPF digitado utilizando a função "sml_appendMessageField" para apresentar uma mensagem ao lado do campo se o CPF é válido ou não.
@PARAM: @Objcpf = OBJ DO CAMPO CPF.
Ex de chamada: onchange="sml_checkCPF(this);"
*/
function sml_checkCPF(Objcpf) {
    var cpf = Objcpf.value;

    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') {
        sml_appendMessageField(Objcpf, "CPF inválido!", "spanCpfMessage", false);
        Objcpf.value = '';
    }
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") {
        sml_appendMessageField(Objcpf, "CPF inválido!", "spanCpfMessage", false);
        Objcpf.value = '';
    } else {

        // Valida 1o digito 
        add = 0;
        for (i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }

        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9))) {
            sml_appendMessageField(Objcpf, "CPF inválido!", "spanCpfMessage", false);
            Objcpf.value = '';
        } else {

            // Valida 2o digito 
            add = 0;
            for (i = 0; i < 10; i++) {
                add += parseInt(cpf.charAt(i)) * (11 - i);
            }

            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(10))) {
                sml_appendMessageField(Objcpf, "CPF inválido!", "spanCpfMessage", false);
                Objcpf.value = '';
            } else {
                sml_appendMessageField(Objcpf, "", "spanCpfMessage", true);
            }
        }
    }
}

/*
Valida o CNPJ digitado utilizando a função "sml_appendMessageField" para apresentar uma mensagem ao lado do campo se o CNPJ é válido ou não.
@PARAM: @Obj = OBJ DO CAMPO.
Ex de chamada: onchange="sml_checkCNPJ(this);"
*/
function sml_checkCNPJ(Obj) {

    cnpj = Obj.value.replace(/\./gi, "").replace(/\//gi, "").replace(/-/gi, "");
    console.log(cnpj);

    if (!cnpj || cnpj.length != 14
        || cnpj == "00000000000000"
        || cnpj == "11111111111111"
        || cnpj == "22222222222222"
        || cnpj == "33333333333333"
        || cnpj == "44444444444444"
        || cnpj == "55555555555555"
        || cnpj == "66666666666666"
        || cnpj == "77777777777777"
        || cnpj == "88888888888888"
        || cnpj == "99999999999999") {
        sml_appendMessageField(Obj, "CNPJ inválido!", "spanCnpjMessage", false);
        Obj.value = '';
        return false;
    }

    var tamanho = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(0)) {
        sml_appendMessageField(Obj, "CNPJ inválido!", "spanCnpjMessage", false);
        Obj.value = '';
        return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(1)) {
        sml_appendMessageField(Obj, "CNPJ inválido!", "spanCnpjMessage", false);
        Obj.value = '';
        return false;
    } else {
        sml_appendMessageField(Obj, "", "spanCnpjMessage", true);
        return true;
    }

}

/*
Formata a data recebida em dateString pt-BR.
@PARAM: @strDate = Data.
@PARAM: @str = Caracter separador da data, ex: "/" ou "-".
Ex de chamada: sml_makeDate('2020.12.05', '.');
Resultado: 05/12/2020
 */
function sml_makeDate(strDate, str) {
    var pieces = strDate.split(str);
    var newDate = pieces[2] + "/" + pieces[1] + "/" + pieces[0];
    return newDate;
}

/*
Adiciona ou remove obrigatoriedade no campo.
@PARAM: @fieldId = Identificador.
@PARAM: @isRequired = true or false.
Ex de chamada para obrigar: sml_IsRequired('identificadorDoCampo', true);
Ex de chamada para desobrigar: sml_IsRequired('identificadorDoCampo', false);
*/
function sml_IsRequired(fieldId, isRequired) {
    var tr;
    var obj;

    if(fieldId.indexOf(",") >= 0) {
        var Ids = fieldId.split(',');

        Array.from(Ids).forEach(id => {
            obj = document.querySelector("[xname='inp" + id + "']");
            tr = sml_Closest(obj, "tr");

            if (isRequired) {
                obj.setAttribute('required', 'S');
                tr.setAttribute('class', 'execute-required');
            } else {
                obj.setAttribute('required', 'N');
                tr.setAttribute("class", "");
            }

        });
    } else {

        obj = document.querySelector("[xname='inp" + fieldId + "']");
        tr = sml_Closest(obj, "tr");
        
        if (isRequired) {
            obj.setAttribute('required', 'S');
            tr.setAttribute('class', 'execute-required');
        } else {
            obj.setAttribute('required', 'N');
            tr.setAttribute("class", "");
        }
    }

}

/*
Função responsável por esconder/mostrar opções de uma caixa de seleção localizado ou não em uma tabela multi-valorada.
@PARAM: @selectId = Identificador da Caixa de seleção.
@PARAM: @selectValues = Opções da caixa de seleção.
@PARAM: @op = operação. Valores: SHOW ou HIDE.
@PARAM: @hasMultiple = Se a caixa de seleção estiver dentro de uma tabela multi-valorada. Valores do parâmetro: true ou false.
@PARAM: @tableId = identificador da tabela multi-valorada.
Ex de chamada com tabela multi-valorada: sml_ShowOrHideSelectOptions("identificador", "Opção 1, Opção 2, Opção 5", "HIDE", true, "tblAlteracoesNoDocumento");
Ex de chamada com tabela multi-valorada: sml_ShowOrHideSelectOptions("identificador", "Opção 1, Opção 2, Opção 5", "SHOW", true, "tblAlteracoesNoDocumento");
Ex de chamada sem tabela multi-valorada: sml_ShowOrHideSelectOptions("identificador", "Opção 1, Opção 2, Opção 5", "HIDE", false, "");
Ex de chamada sem tabela multi-valorada: sml_ShowOrHideSelectOptions("identificador", "Opção 1, Opção 2, Opção 5", "SHOW", false, "");
 */
function sml_ShowOrHideSelectOptions(selectId, selectValues, op, hasMultiple, tableId) {
    var tbl;
    var select;
    var arrayOptValues;

    if (hasMultiple) {
        tbl = document.getElementById(tableId);

        Array.from(tbl.tBodies[0].rows).forEach(row => {
            select = row.querySelector('[xname="inp' + selectId + '"]');

            if (select && select.length > 0) {
                //Loop para cada opção do meu select.
                Array.from(select).forEach(option => {
                    //Verifica se existe mais de uma opção para ocultar ou mostrar.
                    if (selectValues.indexOf(",") >= 0) {

                        arrayOptValues = selectValues.split(",");
                        //Loop para cada opção que desejo esconder.
                        Array.from(arrayOptValues).forEach(arrayOpt => {
                            if (arrayOpt.toUpperCase() == option.text.toUpperCase()) {
                                if (op.toUpperCase() == "HIDE") {
                                    option.disabled = true;
                                    option.style.display = 'none';
                                } else {
                                    option.disabled = false;
                                    option.style.display = 'block';
                                }
                            }
                        });

                    } else {

                        if (option.text.toUpperCase() == selectValues.toUpperCase()) {
                            if (op.toUpperCase() == "HIDE") {
                                option.disabled = true;
                                option.style.display = 'none';
                            } else {
                                option.disabled = false;
                                option.style.display = 'block';
                            }
                        }
                            
                    }
                    
                });
            }
        });

    } else {

        select = document.querySelector('[xname="inp' + selectId + '"]');

        if (select.length > 0) {
            //Loop para cada opção do meu select.
            Array.from(select).forEach(option => {
                //Verifica se existe mais de uma opção para ocultar ou mostrar.
                if (selectValues.indexOf(",") >= 0) {

                    arrayOptValues = selectValues.split(",");
                    //Loop para cada opção que desejo esconder.
                    Array.from(arrayOptValues).forEach(arrayOpt => {
                        if (arrayOpt.toUpperCase() == option.text.toUpperCase()) {
                            if (op.toUpperCase() == "HIDE") {
                                option.disabled = true;
                                option.style.display = 'none';
                            } else {
                                option.disabled = false;
                                option.style.display = 'block';
                            }
                        }
                    });

                } else {

                    if (option.text.toUpperCase() == selectValues.toUpperCase()) {
                        if (op.toUpperCase() == "HIDE") {
                            option.disabled = true;
                            option.style.display = 'none';
                        } else {
                            option.disabled = false;
                            option.style.display = 'block';
                        }
                    }

                }

            });
        }

    }

}

/*
 Função responsável por formatar o campo em telefone.
 @PARAM: @obj = objeto.
 Ex de chamada: onkeyup="sml_PhoneMask(this);"
 Ex de chamada: onblur="sml_PhoneMask(this);"
 Ex de chamada: onchange="sml_PhoneMask(this);"
*/
function sml_PhoneMask(obj) {

    var phoneNumber = obj.value.replace(/[^\d]+/g, '');    //Somente Numeros.
    var ddd;
    var firstPhoneDigits;
    var lastPhoneDigits;

    if (phoneNumber != "" && phoneNumber != null && phoneNumber != undefined) {
        //Celular
        if (phoneNumber.length > 10) {

            ddd = phoneNumber.substr(0, 2);                 //Pega os 2 primeiros dígitos
            firstPhoneDigits = phoneNumber.substr(2, 5);    //Pega os 5 primeiros dígitos após o ddd
            lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 últimos dígitos
            phoneNumber = `(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;
            //Fixo
        } else if (phoneNumber.length === 10) {

            ddd = phoneNumber.substr(0, 2);                 //Pega os 2 primeiros dígitos
            firstPhoneDigits = phoneNumber.substr(2, 4);    //Pega os 4 primeiros dígitos após o ddd
            lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 últimos dígitos
            phoneNumber = `(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;

        }
        obj.value = phoneNumber;
    }

}

/*
EXEMPLO DE FUNÇÃO PARA CONTROLAR TABELA MULTI-VALORADA AO INSERIR OU REMOVER LINHAS
Ao adicionar/remover uma linha na tabela multi-valorada, adiciona função de controle nos botões.
@PARAM: @tblId = Id tabela.
Ex de chamada: sml_addFunctionOnInsertAndDeleteTableValue('tblRepresentantesLegais');
*/
function sml_addFunctionOnInsertAndDeleteTableValue(tblId) {
    //número de linhas permitidas
    //EX: numberLinesAllowed = 0; = 1 linha permitida.
    //EX: numberLinesAllowed = 1; = 2 linhas permitidas.
    //EX: numberLinesAllowed = 2; = 3 linhas permitidas.
    //EX: numberLinesAllowed = 3; = 4 linhas permitidas.
    var numberLinesAllowed = 3;
    var tbl = document.getElementById(tblId);

    if (tbl && tbl.rows.length > 0) {
        var btnInsertRow = tbl.querySelector('[id="btnInsertNewRow"]');
        btnInsertRow.addEventListener("click", function () {
            sml_CheckTableLines(tbl);
            sml_DeleteTableLine(tbl);
        });
    }

    /*
     Após inserir a linha da tabela multi-valorada verifica a quantidade de linhas adicionadas e faz as regras.
     @PARAM: @tbl = Objeto tabela.
    */
    function sml_CheckTableLines(tbl) {
        var btnInsertRow;
        if (tbl && tbl.rows.length > 0) {
            var tableLines = tbl.rows.length - 1;
            btnInsertRow = tbl.querySelector('[id="btnInsertNewRow"]');

            if (tableLines > numberLinesAllowed)
                btnInsertRow.style.display = "none";
            else
                btnInsertRow.style.display = "";
        }
    }
    /*
    Para cada botão de Excluir linha da tabela, adiciona a função de verificar a quantidade de linhas para mostrar o botão de inserir linhas.
    @PARAM: @tbl = Objeto tabela.
    */
    function sml_DeleteTableLine(tbl) {
        var btnDelete;
        btnDelete = tbl.querySelectorAll('[id="btnDeletewRow"]');

        if (btnDelete && btnDelete.length > 0) {
            Array.from(btnDelete).forEach(button => {
                button.addEventListener("click", function () {
                    sml_CheckTableLines(tbl);
                });
            });
        }
    }

}

/*
EXEMPLO DE FUNÇÃO PARA GERENCIAR URLS E CONSUMIR UMA FONTE DE DADOS
@PARAM: @valueToSearch = Valor a ser pesquisado por uma fonte de dados.
@PARAM: @operation = Operação, ex: cpf/cnpj.
Ex de chamada: sml_LoadXhttp('111.111.111-11', 'cpf');
*/
function sml_LoadXhttp(valueToSearch, operation) {
    var url = "";

    //Verifica qual operação deve ser pesquisada. Cada operação é uma fonte de dados diferente.
    switch (operation.toLowerCase()) {

        case "todos-usuarios":
            url = `${fonteDeDados}`;
            break;

        case "cpf":
            url = `${fonteDeDados}`;
            break;

        default:
            url = "";
            break;

    }

    //Realiza a pesquisa
    if (url !== "")
        sml_XhttpMainSearch(url);

}

/*
EXEMPLO DE FUNÇÃO AJAX CONSUMINDO UMA FONTE DE DADOS
Função responsável por listar todos usuários do sistema e preencher uma tabela multivalorada.
@PARAM: @cpf = CPF.
Ex de chamada: sml_XhttpMainSearch('111.111.111-11', 'https://suafontededados.com.br/');
*/
function sml_XhttpMainSearch(url) {
    var xhttp = new XMLHttpRequest();
    var message;

    if (url !== null && url !== undefined && url !== "") {
        //
        //

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const result = JSON.parse(this.responseText);
                var i = 0;
                var btnInsertNewLine = document.getElementById("btnInsertNewRow");
                
                if (result.success.length > 0) {
                    Array.from(result.success).forEach(res => {
                        var fields;

                        if (i > 0)
                            btnInsertNewLine.click();

                        //Campo que será preenchido.
                        fields = document.querySelectorAll('[xname="inpnome"]');
                        if (fields.length > 0) {
                            var lastField = fields[fields.length - 1];
                            lastField.value = res.fields.nome;
                        }

                        i++;
                    });
                }

            } else {
                if (this.readyState == 4 && this.status != 200) {
                    message = `Ocorreu um erro ao executar a consulta.\r\n${this.responseText}`;
                    alert(message);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

}

/*
 * Desenvolvedor: Igor Becker
Função para realizar a criação de uma senha aleatória.
@PARAM: @obj = objeto que ficará salvo o resultado.
Ex de chamada: sml_GeneratePassword(this);
*/
function sml_GeneratePassword(obj) {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    obj.value = retVal;
}

var p001Form = {
    Settings: {
        TimeOut: 200,
        DataSources: {
            GetBusinessRules: {
                name: 'P001 - Regras de Documentos Obrigat?rios', value: '../api/internal/legacy/1.0/datasource/get/1.0/qw0Xk6xWKL563BI8VvBqJuml4PBGOiTftoq5BoAFLR7bx1hPsrcNi7PonxD9rFVEaHOO@k6BIQXRppW7ySlvnw__'
            }
        }

    },

    Functions: {
        buildParamsToGetDataSource: ((params) => {
            var resultParams = '?';
            Object.entries(params).forEach((field, index) => {
                resultParams += index > 0 ? '&' : '';
                resultParams += field[0] + "=" + field[1];
            });
            return resultParams;
        }),
    
        GetFromOrquestraDataSource: (async (dataSource, params) => {
            var result = '';
            let strParams = '';
        
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
        
            if (params)
                strParams = p001Form.Functions.buildParamsToGetDataSource(params);
        
            var url = dataSource.value + (strParams == '?' ? '' : strParams);
            await fetch(url, requestOptions)
                .then(response => response.json())
                .then(rst => { result = rst.success.length > 1 ? rst.success : rst.success[0] })
                .catch(error => {
                    cryo_alert('Erro na consulta da Fonde de dados <b>' + dataSource.name + '</b>', error);
                    return false
                })
        
            return result;
        
        }),
        
        searchBusinessRules: (async () => {
            var inputparams = {
                inptipoEmpresa: document.getElementById("inptipoEmpresa").value,
                inptipoCliente: document.getElementById("inptipoCliente").value,
                inppossuiProcurador: document.getElementById("inppossuiProcurador").value,
                inpcapitalSocialMaior: document.getElementById("inpcapitalSocialMaior").value,
                inpexisteBeneficiarioFinal: document.getElementById("inpexisteBeneficiarioFinal").value
            }
        
            await p001Form.Functions.GetFromOrquestraDataSource(p001Form.Settings.DataSources.GetBusinessRules, inputparams)
                .then(result => {
                    let allResults = '';
                    let allResultsJson = [];
                    let xresult = [];
        
                    if (result.constructor == Array) {
                        xresult = result;
                    } else {
                        xresult.push(result);
                    }
        
                    console.log(xresult);
                    Array.from(xresult).forEach(res => {
                        if (res.fields.documentosObrigatorios != "") {
                            Array.from(JSON.parse(res.fields.documentosObrigatorios)).forEach((doc) => {
                                allResults += `<br>${doc.Document}`;
                                allResultsJson.push(doc);
                            });
                        }
                    });
        
                    if (allResults.length > 0) {
                        document.getElementById('inpdocumentosObrigatorios').value = allResults.substring(4, allResults.length);
                        document.querySelector('[xid="divdocumentosObrigatorios"]').innerHTML = allResults.substring(4, allResults.length);
                        document.getElementById('inpdocumentosObrigatoriosJson').value = JSON.stringify(allResultsJson);
                    } else {
                        document.getElementById('inpdocumentosObrigatorios').value = "";
                        document.querySelector('[xid="divdocumentosObrigatorios"]').innerHTML = "";
                        document.getElementById('inpdocumentosObrigatoriosJson').value = "";
                    }
                });
                
        }),

    }
}


