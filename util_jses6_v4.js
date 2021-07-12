var p001Form = {
    Settings: {
        TimeOut: 200,
        IsDebug: true,
        DataSources: {
            GetCepData: {
                name: 'P001 - Get CEP Data',
                value: 'https://viacep.com.br/ws/{params}/json/'
            }
        }
    },
    NativeResources: {
        Loader: null
    },
    Functions: {
        IsNullOrEmptySpace: ((obj) => {
            var result = true;

            if (obj != undefined && obj != null) {
                if (obj.constructor == String && obj.trim() != '' && obj.trim().length > 0)
                    result = false;
                if (obj.constructor == Object && obj != {})
                    result = false;
                if (obj.constructor == Array && obj.length > 0)
                    result = false;
            }
            return result;
        }),
        WriteLogConsole: ((data) => {
            if (p001Form.Settings.IsDebug)
                console.log(data);
        }),
        BuildParamsToGetDataSource: ((params) => {
            var resultParams = '?';
            Object.entries(params).forEach((field, index) => {
                resultParams += index > 0 ? '&' : '';
                resultParams += field[0] + "=" + field[1];
            });
            return resultParams;
        }),
        GetFromOrquestraDataSource: (async (dataSource, params) => {
            p001Form.NativeResources.Loader.element.style.display = 'block';

            var result = '';
            let strParams = '';
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }

            if (params)
                strParams = p001Form.Functions.BuildParamsToGetDataSource(params);

            var url = dataSource.value + (strParams == '?' ? '' : strParams);
            await fetch(url, requestOptions)
                .then(response => {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(data => {
                            p001Form.Functions.WriteLogConsole("Fonte de dados: " + dataSource.name);
                            p001Form.Functions.WriteLogConsole(data);
                            return data;
                        }).catch(error => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(error);
                            return null;
                        });
                    } else {
                        return response.text().then(text => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(text);
                            return null;
                        });
                    }
                })
                .then(rst => {
                    if (rst != null)
                        result = rst.success.length > 1 ? rst.success : rst.success[0];
                    else
                        result = null;
                })
                .catch(error => {
                    console.error("Fonte de dados: " + dataSource.name);
                    console.error(error);
                    p001Form.NativeResources.Loader.dontShow();
                    cryo_alert('Erro na consulta da Fonte de dados <b>' + dataSource.name + '</b>', error);
                })

            p001Form.NativeResources.Loader.element.style.display = 'none';

            return result;
        }),
        GetFromOtherDataSource: (async (dataSource, params) => {
            p001Form.NativeResources.Loader.element.style.display = 'block';

            var result = '';
            let strParams = '';
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }

            var url = dataSource.value.replace('{params}', params.value);
            await fetch(url, requestOptions)
                .then(response => {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(data => {
                            p001Form.Functions.WriteLogConsole("Fonte de dados: " + dataSource.name);
                            p001Form.Functions.WriteLogConsole(data);
                            return data;
                        }).catch(error => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(error);
                            return null;
                        });
                    } else {
                        return response.text().then(text => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(text);
                            return null;
                        });
                    }
                })
                .then(rst => {
                    if (rst != null && rst != undefined) {
                        if (rst.success != null && srt.success != undefined)
                            result = rst.success.length > 1 ? rst.success : rst.success[0];
                        else
                            result = rst;
                    } else {
                        result = null;
                    }
                })
                .catch(error => {
                    console.error("Fonte de dados: " + dataSource.name);
                    console.error(error);
                    p001Form.NativeResources.Loader.dontShow();
                    cryo_alert('Erro na consulta da Fonte de dados <b>' + dataSource.name + '</b>', error);
                })

            p001Form.NativeResources.Loader.element.style.display = 'none';

            return result;
        }),
        PostToOrquestraDataSource: (async (dataSource, params) => {
            p001Form.NativeResources.Loader.element.style.display = 'block';

            var result = '';
            let strParams = '';
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
                body: JSON.stringify(params)
            }

            await fetch(dataSource.value, requestOptions)
                .then(response => {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json().then(data => {
                            p001Form.Functions.WriteLogConsole("Fonte de dados: " + dataSource.name);
                            p001Form.Functions.WriteLogConsole(data);
                            return data;
                        }).catch(error => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(error)
                            return null;
                        });
                    } else {
                        return response.text().then(text => {
                            console.error("Fonte de dados: " + dataSource.name);
                            console.error(text);
                            return null;
                        });
                    }
                })
                .then(rst => {
                    if (rst != null)
                        result = rst.success.length > 1 ? rst.success : rst.success[0];
                    else
                        result = null;
                })
                .catch(error => {
                    console.error("Fonte de dados: " + dataSource.name);
                    console.error(error);
                    p001Form.NativeResources.Loader.dontShow();
                    cryo_alert('Erro na consulta da Fonte de dados <b>' + dataSource.name + '</b>', error);
                })

            p001Form.NativeResources.Loader.element.style.display = 'none';
            return result;
        }),

        CreateElementMapping: function (fldSelector) {
            this.element = document.querySelector(fldSelector);

            if (this.element == null) {
                fldSelector = fldSelector + '-1';
                this.element = document.querySelector(fldSelector);
            }

            this.originalDisplay = document.querySelector(fldSelector).tagName == 'TABLE' ? 'table' : document.querySelector(fldSelector).style.display;

            this.dontShow = (() => {
                this.element.style.display = 'none';

                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'TEXTAREA'))) {

                    var td = p001Form.Functions.GetTdFields(this.element);

                    if (td) {
                        td.style.visibility = 'hidden';
                    }
                }
            });
            this.reveal = (() => {
                this.element.style.display = this.originalDisplay;
                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'TEXTAREA'))) {
                    var td = p001Form.Functions.GetTdFields(this.element);

                    if (td) td.style.visibility = 'visible';
                }
            });
            this.dontRequire = (() => {
                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'TEXTAREA'))) {
                    this.element.setAttribute('required', 'N');
                }
            });
            this.require = (() => {
                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'TEXTAREA'))) {
                    this.element.setAttribute('required', 'S');
                }
            });
            this.readOnly = (() => {
                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                    this.element.readOnly = true;
                }

                if (this.element.tagName == 'SELECT') {
                    this.element.classList.add('readOnlyType');
                }
            });
            this.readEdit = (() => {
                if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                    this.element.readOnly = false;
                }

                if (this.element.tagName == 'SELECT') {
                    this.element.classList.remove('readOnlyType');
                }
            });
            if (this.element.type == 'checkbox' || this.element.type == 'radio')
                this.options = document.querySelectorAll('[xname=' + fldSelector.replace('#', '') + ']');
        },
        MapDefaultElements: (() => {
            p001Form.NativeResources.Loader = new p001Form.Functions.CreateElementMapping('.app-overlay');
        }),

        zeev_hideTables: ((tableIds, clean) => {
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

        }),
        zeev_showTables: ((tableIds) => {

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
        }),
        zeev_hideFields: ((fieldID) => {
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
                        tr = p001Form.Functions.zeev_closest(field, "tr");
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
                    tr = p001Form.Functions.zeev_closest(field, "tr");
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
                            radioOrCheckFields = document.querySelectorAll('[xname="inp' + fieldID.trim() + '"]');

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
        }),
        zeev_showFields: ((fieldID) => {
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
                        tr = p001Form.Functions.zeev_closest(field, "tr");
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
                    tr = p001Form.Functions.zeev_closest(field, "tr");
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
        }),
        zeev_closest: ((obj, el) => {

            if (obj) {

                if (obj.nodeName == el.toUpperCase())
                    return obj;
                else
                    return p001Form.Functions.zeev_closest(obj.parentElement, el);

            } else {
                return null;
            }

        }),

        zevv_phoneMask: ((obj, countryCode) => {
            var phoneNumber = obj.value.replace(/[^\d]+/g, '');    //Somente Numeros.
            var ddd;
            var firstPhoneDigits;
            var lastPhoneDigits;

            if (phoneNumber != "" && phoneNumber != null && phoneNumber != undefined) {

                if (countryCode) {
                    //Celular
                    if (phoneNumber.length > 12) {
                        pais = phoneNumber.substr(0, 2);                //Pega os 2 primeiros digitos
                        ddd = phoneNumber.substr(2, 2);                 //Pega os 2 proximos digitos
                        firstPhoneDigits = phoneNumber.substr(4, 5);    //Pega os 5 primeiros digitos apos o ddd
                        lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 ultimos digitos
                        phoneNumber = `+${pais}(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;
                        //Fixo
                    } else if (phoneNumber.length === 12) {
                        pais = phoneNumber.substr(0, 2);                //Pega os 2 primeiros digitos
                        ddd = phoneNumber.substr(2, 2);                 //Pega os 2 proximos digitos
                        firstPhoneDigits = phoneNumber.substr(4, 4);    //Pega os 4 primeiros digitos apos o ddd
                        lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 ultimos digitos
                        phoneNumber = `+${pais}(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;

                    }
                } else {
                    //Celular
                    if (phoneNumber.length > 10) {

                        ddd = phoneNumber.substr(0, 2);                 //Pega os 2 primeiros dьgitos
                        firstPhoneDigits = phoneNumber.substr(2, 5);    //Pega os 5 primeiros dьgitos apзs o ddd
                        lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 Щltimos dьgitos
                        phoneNumber = `(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;
                        //Fixo
                    } else if (phoneNumber.length === 10) {

                        ddd = phoneNumber.substr(0, 2);                 //Pega os 2 primeiros dьgitos
                        firstPhoneDigits = phoneNumber.substr(2, 4);    //Pega os 4 primeiros dьgitos apзs o ddd
                        lastPhoneDigits = phoneNumber.substr(-4);       //Pega os 4 Щltimos dьgitos
                        phoneNumber = `(${ddd}) ${firstPhoneDigits}-${lastPhoneDigits}`;

                    }
                }

                obj.value = phoneNumber;
            }
        }),
        /*
        Funcao responsavel por esconder/mostrar opcoes de uma caixa de selecao localizado ou nao em uma tabela multi-valorada.
        @PARAM: @selectId = Identificador da Caixa de selecao.
        @PARAM: @selectValues = opcoes da caixa de selecao.
        @PARAM: @op = operaусo. Valores: SHOW ou HIDE.
        @PARAM: @hasMultiple = Se a caixa de selecao estiver dentro de uma tabela multi-valorada. Valores do parРmetro: true ou false.
        @PARAM: @tableId = identificador da tabela multi-valorada.
        Ex de chamada com tabela multi-valorada: zeev_ShowOrHideSelectOptions("identificador", "opcao 1, opcao 2, opcao 5", "HIDE", true, "tblAlteracoesNoDocumento");
        Ex de chamada com tabela multi-valorada: zeev_ShowOrHideSelectOptions("identificador", "opcao 1, opcao 2, opcao 5", "SHOW", true, "tblAlteracoesNoDocumento");
        Ex de chamada sem tabela multi-valorada: zeev_ShowOrHideSelectOptions("identificador", "opcao 1, opcao 2, opcao 5", "HIDE", false, "");
        Ex de chamada sem tabela multi-valorada: zeev_ShowOrHideSelectOptions("identificador", "opcao 1, opcao 2, opcao 5", "SHOW", false, "");
        */
        zeev_showOrHideSelectOptions: ((selectId, selectValues, op, hasMultiple, tableId) => {
            var tbl;
            var select;
            var arrayOptValues;

            if (hasMultiple) {
                tbl = document.getElementById(tableId);

                Array.from(tbl.tBodies[0].rows).forEach(row => {
                    select = row.querySelector('[xname="inp' + selectId + '"]');

                    if (select && select.length > 0) {
                        //Loop para cada opcao do meu select.
                        Array.from(select).forEach(option => {
                            //Verifica se existe mais de uma opcao para ocultar ou mostrar.
                            if (selectValues.indexOf(",") >= 0) {

                                arrayOptValues = selectValues.split(",");
                                //Loop para cada opcao que desejo esconder.
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
                    //Loop para cada opсao do meu select.
                    Array.from(select).forEach(option => {
                        //Verifica se existe mais de uma opcao para ocultar ou mostrar.
                        if (selectValues.indexOf(",") >= 0) {

                            arrayOptValues = selectValues.split(",");
                            //Loop para cada opcao que desejo esconder.
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

        }),
        zeev_isRequired: ((fieldId, isRequired) => {
            var obj = document.querySelector("[xname='inp" + fieldId + "']");
            var tr = zeev_closest(obj, "tr");

            if (isRequired) {
                obj.setAttribute('required', 'S');
                tr.setAttribute('class', 'execute-required');
            } else {
                obj.setAttribute('required', 'N');
                tr.setAttribute("class", "");
            }
        }),
        /*
        Formata a data recebida em dateString pt-BR.
        @PARAM: @strDate = Data.
        @PARAM: @str = Caracter separador da data, ex: "/" ou "-".
        Ex de chamada: zeev_makeDate('2020.12.05', '.');
        Resultado: 05/12/2020
        */
        zeev_makeDate: ((strDate, str) => {
            var pieces = strDate.split(str);
            var newDate = pieces[2] + "/" + pieces[1] + "/" + pieces[0];
            return newDate;
        }),
        /*
        Faz o append da mensagem no parent do campo (Funcao geralmente utilizada por funушes que validam campos).
        @PARAM: @Obj = OBJ DO CAMPO.
        @PARAM: @message = MENSAGEM.
        @PARAM: @idMessage = ID DA MENSAGEM.
        @PARAM: @isValid = true/false.
        Ex de chamada Cpf invalido: zeev_appendMessageField(this, "CPF invalido!", "spanCpfMessage", false);
        Ex de chamada Cpf vрlido: zeev_appendMessageField(this, "", "spanCpfMessage", true);
        */
        zeev_appendMessageField: ((Obj, message, idMessage, isValid) => {
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
        }),
        /*
        Valida o CPF digitado utilizando a Funcao "sml_appendMessageField" para apresentar uma mensagem ao lado do campo se o CPF ж vрlido ou nao.
        @PARAM: @Objcpf = OBJ DO CAMPO CPF.
        Ex de chamada: onchange="sml_checkCPF(this);"
        */
        sml_checkCPF: ((Objcpf) => {
            var cpf = Objcpf.value;

            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf == '') {
                p001Form.Functions.sml_appendMessageField(Objcpf, "CPF invalido!", "spanCpfMessage", false);
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
                p001Form.Functions.sml_appendMessageField(Objcpf, "CPF invalido!", "spanCpfMessage", false);
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
                    p001Form.Functions.sml_appendMessageField(Objcpf, "CPF invalido!", "spanCpfMessage", false);
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
                        p001Form.Functions.sml_appendMessageField(Objcpf, "CPF invalido!", "spanCpfMessage", false);
                        Objcpf.value = '';
                    } else {
                        p001Form.Functions.sml_appendMessageField(Objcpf, "", "spanCpfMessage", true);
                    }
                }
            }
        }),
        /*
        Valida o CNPJ digitado utilizando a Funcao "sml_appendMessageField" para apresentar uma mensagem ao lado do campo se o CNPJ ж vрlido ou nao.
        @PARAM: @Obj = OBJ DO CAMPO.
        Ex de chamada: onchange="sml_checkCNPJ(this);"
        */
        sml_checkCNPJ: ((Obj) => {

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
                p001Form.Functions.sml_appendMessageField(Obj, "CNPJ invalido!", "spanCnpjMessage", false);
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
                p001Form.Functions.sml_appendMessageField(Obj, "CNPJ invalido!", "spanCnpjMessage", false);
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
                p001Form.Functions.sml_appendMessageField(Obj, "CNPJ invalido!", "spanCnpjMessage", false);
                Obj.value = '';
                return false;
            } else {
                p001Form.Functions.sml_appendMessageField(Obj, "", "spanCnpjMessage", true);
                return true;
            }

        }),
        zeev_confirm: ((msg, okcallback) => {
            let closeColorbox = true;

            $.colorbox({
                closeButton: false,
                width: (clientIsMobile ? "90%" : "400px"),
                //html: '<div class="cryo-confirm-dialog padded"><h3>' + msg + '</h3><div class="spaced text-right"><button type="button" class="btn btn-success ' + (clientIsMobile ? 'btn-large' : '') + '" accesskey="' + mlLblYesAccessKey + '">' + mlLblYes + '</button> <button type="button" class="btn btn-default ' + (clientIsMobile ? 'btn-large' : '') + '" accesskey="' + mlLblNoAccessKey + '">' + mlLblNo + '</button></div></div>' 
                html:
                    `
                <div class="cryo-confirm-dialog padded">
                    <h3>${msg}</h3>
                    <div class="spaced text-right">
                        <button type="button" class="btn btn-success${(clientIsMobile ? 'btn-large' : '')}" accesskey="${mlLblYesAccessKey}">${mlLblYes}</button>
                        <button type="button" class="btn btn-default${(clientIsMobile ? 'btn-large' : '')}" accesskey="${mlLblNoAccessKey}">${mlLblNo}</button>
                    </div>
                </div>
                `
            });
            cryo_UnderlineAccessKey('div.cryo-confirm-dialog');
            $(".cryo-confirm-dialog").find(".btn-success").focus();
            $(".cryo-confirm-dialog").find(".btn-success").click(function () {
                if (closeColorbox) {
                    $.colorbox.close();
                }
                okcallback();
            });
            $(".cryo-confirm-dialog").find(".btn-default").click(function () {
                $.colorbox.close();
            });
        }),
        zeev_alert: ((msg, okcallback) => {
            msg = msg.replace(/\n/g, '<br>');
            $.colorbox({
                closeButton: false,
                width: (clientIsMobile ? "90%" : "400px"),
                //html: '<div class="cryo-confirm-dialog padded"><h2>' + mlLblAtention + '!</h2><p>' + msg + '</p><div class="spaced text-right"><button type="button" class="btn btn-success ' + (clientIsMobile ? 'btn-large' : '') + '">OK</button></div></div>' 
                html: `
                <div class="cryo-confirm-dialog padded">
                    <h2>${mlLblAtention}</h2>
                    <p>${msg}</p>
                    <div class="spaced text-right">
                        <button type="button" class="btn btn-success${(clientIsMobile ? 'btn-large' : '')}">OK</button>
                    </div>
                </div>
                `
            });
            cryo_UnderlineAccessKey('div.cryo-confirm-dialog');
            $(".cryo-confirm-dialog").find(".btn-success").focus();
            $(".cryo-confirm-dialog").find(".btn-success").click(function () {
                $.colorbox.close();
                if (okcallback != null && okcallback != undefined)
                    okcallback();
            });
        }),

        PageRulesByTask: (async (task) => {
            switch (task.toUpperCase()) {
                case "T01":
                    console.log("CurrentTask: " + task);
                    break;
                default:
                    let cepField = document.getElementById('inpcep');

                    cepField.addEventListener('blur', function () {
                        let params = {
                            value: this.value.replace(/\D/g, '')
                        }
                        p001Form.Functions.GetFromOtherDataSource(p001Form.Settings.DataSources.GetCepData, params)
                            .then(res => {
                                if (res){
                                    document.getElementById('inplogradouro').value = res.logradouro;
                                    document.getElementById('inpcomplemento').value = res.complemento;
                                    document.getElementById('inpbairro').value = res.bairro;
                                    document.getElementById('inpcidade').value = res.localidade;
                                    document.getElementById('inpuf').value = res.uf;
                                } else {
                                    this.value = '';
                                    document.getElementById('inplogradouro').value = ''
                                    document.getElementById('inpcomplemento').value = '';
                                    document.getElementById('inpbairro').value = '';
                                    document.getElementById('inpcidade').value = '';
                                    document.getElementById('inpuf').value = '';

                                    p001Form.Functions.zeev_alert('Cep não encontrado!');
                                }
                            });
                    });

                    console.log("CurrentTask: " + task);
                    break;
            }
        }),

        Init: (() => {
            //Esconde a box do canto esquerdo.
            document.getElementById("commands").parentNode.style.display = "none";
            //Aumenta o tamanho da tela
            document.getElementById("ContainerForm").parentNode.classList.remove("col-lg-10");
            document.getElementById("ContainerForm").parentNode.classList.add("col-lg-12");
            p001Form.Functions.MapDefaultElements();
            //Faz o mapeamento dos elementos/eventos restantes para cada tarefa
            p001Form.Functions.PageRulesByTask(document.getElementById("inpDsFlowElementAlias").value);
        })
    }
}