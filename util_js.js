window.addEventListener("load", function () {

    //Utilizado para pegar o apelido da tarefa atual.
    var task = document.getElementById('inpDsFlowElementAlias').value;

    sml_RulesOfPageLoadByTask(task);

});

/*
 * Desenvolvedor: Igor Becker
Realiza as Regras da P�gina apos carregamento do formulario
@PARAM: @task = Apelido da tarefa.
Ex de chamada: sml_RulesOfPageLoadByTask(document.getElementById('inpDsFlowElementAlias').value);
*/
function sml_RulesOfPageLoadByTask(task) {
    var tablesToHide;
    var fieldsToHide;

    switch (task.toUpperCase()) {

        case "START":
            tablesToHide = `tblColaboradores,
                            Endere�o`;
            fieldsToHide = "";

            sml_HideTables(tablesToHide);

            break;

        default:
            break;

    }

}

/*
 * Desenvolvedor: Igor Becker
Esconde uma tabela/agrupamento inteiro, desobriga seus campos e limpa o valor se necess�rio.
Guarda se os campos da tabela s�o obrigat�rios em um novo atributo "data-isrequired";
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

                        //Se o elemento for diferente de bot�o ou hidden
                        if (type && type != "button" && type != "hidden") {

                            if (type == "text")
                                obj.value = '';

                            if (type == "radio" || type == "checkbox")
                                obj.checked = false;

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

                    //Se o elemento for diferente de bot�o ou hidden
                    if (type && type != "button" && type != "hidden") {
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
    
    if (tableIds !== "") {
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
Mostra uma tabela/agrupamento inteiro e obriga seus campos se eles forem obrigat�rios.
Resgata se os campos da tabela s�o obrigat�rios em um novo atributo "data-isrequired";
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

                    //Se o elemento for diferente de bot�o ou hidden
                    if (type && type != "button" && type != "hidden") {
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

    if (tableIds !== "") {
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
Fun��o respons�vel por esconder e desobrigar um campo.
Guarda se o campo � obrigat�rio em um atributo novo "xrequired".
@PARAM: @fieldID = identificador do campo/campos.
Ex de chamada: sml_Hide('nome,cpf');
*/
function sml_Hide(fieldID) {
    if (fieldID !== "" && fieldID !== null && fieldID !== undefined) {
        var field;
        var radioOrCheckFields;
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

                //Se o elemento for diferente de bot�o ou hidden
                if (fieldType && fieldType != "button" && fieldType != "hidden") {

                    if (fieldType == "text")
                        field.value = '';

                    if (fieldType == "select")
                        field.value = '';

                    if (fieldType == "radio" || fieldType == "checkbox") {
                        radioOrCheckFields = document.querySelectorAll('[xname="inp' + id.trim() + '"]');

                        Array.from(radioOrCheckFields).forEach(f => {
                            f.checked = false;
                        });
                    }
                        
                    if (fieldType == "textarea")
                        field.value = '';
                }

                tr.style.display = "none";

            });


        } else {

            field = document.querySelector('[xname="inp' + fieldID + '"]');
            fieldType = field.getAttribute("type") != null ? field.getAttribute("type") : field.type;
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

            //Se o elemento for diferente de bot�o ou hidden
            if (fieldType && fieldType != "button" && fieldType != "hidden") {

                if (fieldType == "text")
                    field.value = '';

                if (fieldType == "select" || fieldType == "select-one")
                    field.value = '';

                if (fieldType == "radio" || fieldType == "checkbox") {
                    radioOrCheckFields = document.querySelectorAll('[xname="inp' + id.trim() + '"]');

                    Array.from(radioOrCheckFields).forEach(f => {
                        f.checked = false;
                    });
                }

                if (fieldType == "textarea")
                    field.value = '';
            }

            tr.style.display = "none";

            if (tr.getAttribute('class') != "group")
                tr.setAttribute('class', 'NObrigatorio');
        }
    }
}

/*
 * Desenvolvedor: Igor Becker
Fun��o respons�vel por mostrar e obrigar o campo se ele for obrigat�rio.
Resgata se o campo � obrigat�rio atraves do atributo novo "xrequired".
@PARAM: @fieldID = identificador do campo/campos.
Ex de chamada: sml_Show('nome,cpf');
*/
function sml_Show(fieldID) {
    if (fieldID !== "" && fieldID !== null && fieldID !== undefined) {
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

                if (isrequired == "true" && fieldType != "hidden")
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
            if (isrequired == "true" && fieldType != "hidden")
                field.setAttribute('required', 'S');

            tr.style.display = "";

            if (isrequired == "true" && tr.getAttribute('class') != "group")
                tr.setAttribute('class', 'Obrigatorio');
        }
    }
}

/*
 * Desenvolvedor: Igor Becker
Fun��o para retornar o elemento mais proximo de um objeto.
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
 * Desenvolvedor: Igor Becker
Esconde ou mostra uma tabela apos selecionar valor no campo
@PARAM: @obj = Objeto.
@PARAM: @tableId = identificador da tabela.
@PARAM: @valToHide = Condicao para esconder tabela.
@PARAM: @tableOrField = Condicao para esconder tabela ou campo. Valores aceitos table ou field.
Ex de chamada: onChange="sml_OnChange(this, 'tblExemplo', 'N�o', 'table');"
*/
function sml_OnChange(obj, ids, valToHide, tableOrField) {

    if (obj.value != null && obj.value != "" && obj.value != undefined) {

        if (obj.value == valToHide) {

            if (tableOrField) {
                if (tableOrField.toUpperCase() == "TABLE") 
                    sml_HideTables(ids, true);
                else
                    sml_Hide(ids, true);
            } else {
                alert('Erro ao ocultar elemento: Informe se deseja ocultar uma tabela ou um campo!');
            }

        } else {
            if (tableOrField) {
                if (tableOrField.toUpperCase() == "TABLE")
                    sml_ShowTables(ids);
                else
                    sml_Show(ids);
            } else {
                alert('Erro ao ocultar elemento: Informe se deseja ocultar uma tabela ou um campo!');
            }
            sml_ShowTables(ids);
        }
            

    } else {
        if (tableOrField.toUpperCase() == "TABLE")
            sml_HideTables(ids, true);
        else
            sml_Hide(ids, true);
    }

}