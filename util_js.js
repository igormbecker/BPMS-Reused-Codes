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
            tablesToHide = `tblColaboradores,
                            Endereço`;
            fieldsToHide = `comprovanteDeResidencia`;

            sml_HideTables(tablesToHide);
            sml_Hide(fieldsToHide);

            break;

        default:
            break;

    }

}

/*
 * Desenvolvedor: Igor Becker
Esconde uma tabela/agrupamento inteiro, desobriga seus campos e limpa o valor se necessário.
Guarda se os campos da tabela são obrigatórios em um novo atributo "data-isrequired";
@PARAM: @ids = identificador da tabela/tabelas.
@PARAM: @clean = true/false.
Ex de chamada: sml_HideTables('tblRepresentante,Dados da Solicitacao', false);
*/
function sml_HideTables(tableIds, clean) {
    clean = clean || false;

    function hideTablesProcess(id, clean) {
        var i = 0;
        var tbl = document.getElementById(id);

        tbl.style.display = "none";

        if (clean) {
            if (tbl.getAttribute("mult") == "S") {
                //Apaga as linhas da tabela exceto a primeira.
                Array.from(tbl.tBodies[0].rows).forEach(row => {
                    if (i > 1)
                        DeleteRow(row.querySelector('button'));

                    i++;
                });

            }
            //Apaga os valores dos campos dentro da tabela.
            Array.from(tbl.tBodies[0].rows).forEach(row => {
                var inputs = row.querySelectorAll('input');
                var selects = row.querySelectorAll('select');
                var textareas = row.querySelectorAll('textarea');

                //Apaga os valores dos inputs
                if (inputs) {
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
                                var btnDelFile = row.querySelector(".btn-danger");
                                var id = obj.getAttribute("xname").replace('inp', '');

                                if (btnDelFile)
                                    delFileFormField(id, btnDelFile);
                            }
                        }

                    });
                }
                //Faz as regras para os selects
                if (selects) {
                    Array.from(selects).forEach(obj => {
                        obj.value = '';
                    });
                }
                //Faz as regras para os textareas
                if (textareas) {
                    Array.from(selects).forEach(obj => {
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
            if (inputs) {
                Array.from(inputs).forEach(obj => {
                    var type = obj.getAttribute("type");
                    isrequired =
                        (
                            (obj.getAttribute("data-isrequired") != null && obj.getAttribute("data-isrequired") == "true") ||
                            (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                        ) ? true : false;

                    //Se o elemento for diferente de botão ou hidden
                    if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {
                        obj.setAttribute("data-isrequired", isrequired);
                        obj.setAttribute("required", "N");
                    }

                });
            }
            //Faz as regras para os selects
            if (selects) {
                Array.from(selects).forEach(obj => {
                    isrequired =
                        (
                            (obj.getAttribute("data-isrequired") != null && obj.getAttribute("data-isrequired") == "true") ||
                            (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                        ) ? true : false;

                    obj.setAttribute("data-isrequired", isrequired);
                    obj.setAttribute("required", "N");
                });
            }
            //Faz as regras para os textareas
            if (textareas) {
                Array.from(textareas).forEach(obj => {
                    isrequired =
                        (
                            (obj.getAttribute("data-isrequired") != null && obj.getAttribute("data-isrequired") == "true") ||
                            (obj.getAttribute("required") != null && obj.getAttribute("required") == "S")
                        ) ? true : false;

                    obj.setAttribute("data-isrequired", isrequired);
                    obj.setAttribute("required", "N");
                });
            }
            //Faz as regras para as linhas
            if (row.getAttribute("class") != "group" && tbl.getAttribute("mult") != "S")
                row.setAttribute("class", "nObrigatorio");

        });

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
Resgata se os campos da tabela são obrigatórios em um novo atributo "data-isrequired";
@PARAM: @ids = identificador da tabela/tabelas.
@PARAM: @clean = true/false.
Ex de chamada: sml_ShowTables('tblRepresentante,Dados da Solicitacao');
*/
function sml_ShowTables(tableIds) {

    function showTablesProcess(id) {

        var i = 0;
        var tbl = document.getElementById(id);

        tbl.style.display = "";

        //Faz as regras de obrigatoriedade para cada campo da tabela
        Array.from(tbl.tBodies[0].rows).forEach(row => {
            var inputs = row.querySelectorAll('input');
            var selects = row.querySelectorAll('select');
            var textareas = row.querySelectorAll('textarea');
            var wasrequired = '';

            //Faz as regras para os inputs
            if (inputs) {
                Array.from(inputs).forEach(obj => {
                    var type = obj.getAttribute("type");
                    wasrequired = obj.getAttribute("data-isrequired");

                    //Se o elemento for diferente de botão ou hidden
                    if (type && type.toUpperCase() != "BUTTON" && type.toUpperCase() != "HIDDEN") {
                        if (wasrequired != null && wasrequired == "true")
                            obj.setAttribute("required", "S");
                    }

                });
            }
            //Faz as regras para os selects
            if (selects) {
                Array.from(selects).forEach(obj => {
                    wasrequired = obj.getAttribute("data-isrequired");

                    if (wasrequired != null && wasrequired == "true")
                        obj.setAttribute("required", "S");
                });
            }
            //Faz as regras para os selects
            if (textareas) {
                Array.from(textareas).forEach(obj => {
                    wasrequired = obj.getAttribute("data-isrequired");

                    if (wasrequired != null && wasrequired == "true")
                        obj.setAttribute("required", "S");
                });
            }
            //Adiciona a classe obrigatorio na linha caso necessario
            if (row.getAttribute("class") != "group" && tbl.getAttribute("mult") != "S" && wasrequired == "true")
                row.setAttribute("class", "Obrigatorio");

        });

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
                isrequired =
                    (
                        (field.getAttribute("data-isrequired") != null && field.getAttribute("data-isrequired") == "true") ||
                        (field.getAttribute("required") != null && field.getAttribute("required") == "S")
                    ) ? true : false;

                //Guarda a obrigatoriedade no novo atributo.
                if (field.getAttribute('data-isrequired') == undefined)
                    field.setAttribute('data-isrequired', isrequired);

                if (fieldType != "hidden")
                    field.setAttribute('required', 'N');

                //Se o elemento for diferente de botão ou hidden
                if (fieldType && fieldType.toUpperCase() != "BUTTON" && fieldType.toUpperCase() != "HIDDEN") {

                    if (fieldType.toUpperCase() == "TEXT")
                        field.value = '';

                    if (fieldType.toUpperCase() == "SELECT")
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
                        var btnDelFile = tr.querySelector(".btn-danger");

                        if (btnDelFile)
                            delFileFormField(id, btnDelFile);
                    }
                }

                tr.style.display = "none";

            });


        } else {

            field = document.querySelector('[xname="inp' + fieldID + '"]');
            fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
            fieldXType = field.getAttribute("xtype");
            tr = sml_Closest(field, "tr");
            isrequired =
                (
                    (field.getAttribute("data-isrequired") != null && field.getAttribute("data-isrequired") == "true") ||
                    (field.getAttribute("required") != null && field.getAttribute("required") == "S")
                ) ? true : false;

            //Guarda a obrigatoriedade no novo atributo.
            if (field.getAttribute('data-isrequired') == undefined)
                field.setAttribute('data-isrequired', isrequired);

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
                    var btnDelFile = tr.querySelector(".btn-danger");

                    if (btnDelFile)
                        delFileFormField(fieldID, btnDelFile);
                }
            }

            tr.style.display = "none";

            if (tr.getAttribute('class') != "group")
                tr.setAttribute('class', 'NObrigatorio');
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
        var isrequired;

        //Verifica se existe mais de 1 id
        if (fieldID.indexOf(",") >= 0) {
            var Ids = fieldID.replace(' ', '');
            var arrayIds = Ids.split(',');

            Array.from(arrayIds).forEach(id => {
                field = document.querySelector('[xname="inp' + id.trim() + '"]');
                fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
                tr = sml_Closest(field, "tr");
                isrequired = field.getAttribute("data-isrequired");

                if (isrequired == "true" && fieldType.toUpperCase() != "HIDDEN")
                    field.setAttribute('required', 'S');

                tr.style.display = "";

                if (isrequired == "true" && tr.getAttribute('class') != "group")
                    tr.setAttribute('class', 'Obrigatorio');

            });


        } else {

            field = document.querySelector('[xname="inp' + fieldID + '"]');
            fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
            tr = sml_Closest(field, "tr");
            isrequired = field.getAttribute("data-isrequired");

            //Remove a obrigatoriedade do campo
            if (isrequired == "true" && fieldType.toUpperCase() != "HIDDEN")
                field.setAttribute('required', 'S');

            tr.style.display = "";

            if (isrequired == "true" && tr.getAttribute('class') != "group")
                tr.setAttribute('class', 'Obrigatorio');
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
            return sml_Closest(obj.parentElement, "tr");

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
    var obj = document.querySelector("[xname='inp" + fieldId + "']");
    var tr = sml_Closest(obj, "tr");

    if (isRequired) {
        obj.setAttribute('required', 'S');
        tr.setAttribute("class", "Obrigatorio");
    } else {
        obj.setAttribute('required', 'N');
        tr.setAttribute("class", "nObrigatorio");
    }
}