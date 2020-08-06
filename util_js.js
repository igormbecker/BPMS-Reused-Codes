window.addEventListener("load", function () {

    //Utilizado para pegar o apelido da tarefa atual.
    var task = document.getElementById('inpDsFlowElementAlias').value;

    sml_RulesOfPageLoadByTask(task);

});

/*
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

        tbl.style.visibility = "hidden";

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

                //Apaga os valores dos inputs
                if (inputs) {
                    Array.from(inputs).forEach(obj => {
                        var type = obj.getAttribute("type");

                        //Se o elemento for diferente de botão ou hidden
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

            });
        }

        //Remove obrigatoriedade dos campos
        Array.from(tbl.tBodies[0].rows).forEach(row => {
            var inputs = row.querySelectorAll('input');
            var selects = row.querySelectorAll('select');
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

        tbl.style.visibility = "visible";

        //Faz as regras de obrigatoriedade para cada campo da tabela
        Array.from(tbl.tBodies[0].rows).forEach(row => {
            var inputs = row.querySelectorAll('input');
            var selects = row.querySelectorAll('select');
            var wasrequired = '';

            //Faz as regras para os inputs
            if (inputs) {
                Array.from(inputs).forEach(obj => {
                    var type = obj.getAttribute("type");
                    wasrequired = obj.getAttribute("data-isrequired");

                    //Se o elemento for diferente de botão ou hidden
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
            //Adiciona a classe obrigatorio na linha caso necessario
            if (row.getAttribute("class") != "group" && tbl.getAttribute("mult") != "S" && wasrequired == "true")
                row.setAttribute("class", "Obrigatorio");

        });

    }

    if (tableIds !== "") {
        if (tableIds.indexOf(',') >= 0) {
            var arrayIds = tableIds.split(',');

            Array.from(arrayIds).forEach(id => {
                showTablesProcess(id.trim(), clean);
            });

        } else {
            showTablesProcess(tableIds.trim());
        }
    }
}

/*
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
            fieldsToHide = "";

            sml_HideTables(tablesToHide);

            break;

        default:
            break;

    }

}

/*
Esconde ou mostra uma tabela apos selecionar valor no campo
@PARAM: @obj = Objeto.
@PARAM: @tableId = identificador da tabela.
@PARAM: @valToHide = Condicao para esconder tabela.
Ex de chamada: onChange="sml_OnChange(this, 'tblEx', 'Não');"
*/
function sml_OnChange(obj, tableId, valToHide) {

    if (obj.value != null && obj.value != "") {

        if (obj.value == valToHide)
            sml_HideTables(tableId, true);
        else
            sml_ShowTables(tableId);

    } else {
        sml_HideTables(tableId, true);
    }

}