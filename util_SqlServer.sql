-- SCRIPT PARA DELETAR TAREFAS FANTASMAS DO PROCESSO (SQL SERVER)

DECLARE @CODTASK INT
DECLARE @CODFLOWELEMENT INT

SELECT @CODTASK = CodTask, @CODFLOWELEMENT = CodFlowElement FROM wfTASK WHERE DsTaskTitle = 'Nome da Tarefa'

DELETE FROM wfMESSAGE WHERE CodTask = V_CODTASK
DELETE FROM wfTASK_POSITION WHERE CodTask = @CODTASK
DELETE FROM wfFLOW_EXECUTE_SEQUENCE WHERE CodTaskFrom = @CODTASK OR CodTaskTo = @CODTASK
DELETE FROM wfFLOW_EXECUTE_TASK WHERE CodTask = @CODTASK
DELETE FROM wfTASK_GENERAL WHERE CodTask = @CODTASK
DELETE FROM wfTASK_XML WHERE CodTask = V_CODTASK
DELETE FROM wfTASK WHERE CodTask = @CODTASK
DELETE FROM wfFLOW_ELEMENT WHERE CodFlowElement = @CODFLOWELEMENT

-- ############################# - FIM SCRIPT - #############################



-- SCRIPT PARA SELECIONAR VALORES DE OUTRO PROCESSO
BEGIN
WITH 
FORM AS 
(
	SELECT CodFlow FROM WFFLOW WITH(NOLOCK) WHERE DsFlowName = 'Nome do Processo'
),
FONTE_DADOS AS
(
SELECT 		
	[CODFLOWEXECUTE] = Max(L.CodFlowExecute),			
	[CNPJ] = Max((case WHEN DsFieldName='cnpj' THEN DsFormFieldValue END)),		   
	[CPF] = Max((case WHEN DsFieldName='cpf' THEN DsFormFieldValue END)),		   
	[Código SAP] = Max((case WHEN DsFieldName='codigoSap' THEN DsFormFieldValue END)),	
	[Nome]= Max((case WHEN DsFieldName='nome' THEN DsFormFieldValue END)),
	[PesquisaCpf] = 'cpfsearch' 
FROM WFVWFLOW_FORM_FIELD_LOG L WITH(NOLOCK)				
	INNER JOIN FORM ON L.CodFlow = FORM.CodFlow		
	group by [CODFLOWEXECUTE]
)
SELECT [CPF] CodAttributeCustomValue, [CPF] DsAttributeValueName, [Código SAP], [Nome], [PesquisaCpf] FROM FONTE_DADOS
END

-- ############################# - FIM SCRIPT - #############################



--SCRIPT COM CASE NO SELECT
DECLARE
@Idade Int = (SELECT DATEDIFF(YEAR, '11/08/1988', GetDate()))

SELECT
v.CodFlowExecute
,v.Codigo AS CodAttributeCustomValue
,v.NomeComercial
,v.TipoDePlano
,(
	CASE WHEN @Idade <= 18 THEN v.Faixa1 
		 WHEN @Idade > 18 AND @Idade <= 23 THEN v.Faixa2
		 WHEN @Idade > 23 AND @Idade <= 28 THEN v.Faixa3
		 WHEN @Idade > 28 AND @Idade <= 33 THEN v.Faixa4
		 WHEN @Idade > 33 AND @Idade <= 38 THEN v.Faixa5
		 WHEN @Idade > 38 AND @Idade <= 43 THEN v.Faixa6
		 WHEN @Idade > 43 AND @Idade <= 48 THEN v.Faixa7
		 WHEN @Idade > 48 AND @Idade <= 53 THEN v.Faixa8
		 WHEN @Idade > 53 AND @Idade <= 58 THEN v.Faixa9
		 WHEN @Idade > 58 THEN v.Faixa10
	END
) AS DsAttributeValueName
,v.TaxaDeIngresso
FROM (SELECT Max(u.CodFlowExecute) CodFlowExecute, u.Codigo FROM wfUNIMEDSM_TABELA_DE_VENDAS u WITH (NOLOCK) GROUP BY u.Codigo) AS uu
INNER JOIN wfUNIMEDSM_TABELA_DE_VENDAS v WITH (NOLOCK) ON uu.CodFlowExecute = v.CodFlowExecute
WHERE 
v.TipoDePlano = 'Coletivo Por Adesão'
AND v.Codigo = 'CA2A'
ORDER BY CodAttributeCustomValue



DECLARE
@Idade Int = (SELECT DATEDIFF(YEAR, '{Formulario.dataDeNascimentoDependente}', GetDate()))

SELECT
v.CodFlowExecute
,v.Codigo AS CodAttributeCustomValue
,v.NomeComercial
,v.TipoDePlano
,(
	CASE WHEN @Idade <= 18 THEN v.Faixa1 
		 WHEN @Idade > 18 AND @Idade <= 23 THEN v.Faixa2
		 WHEN @Idade > 23 AND @Idade <= 28 THEN v.Faixa3
		 WHEN @Idade > 28 AND @Idade <= 33 THEN v.Faixa4
		 WHEN @Idade > 33 AND @Idade <= 38 THEN v.Faixa5
		 WHEN @Idade > 38 AND @Idade <= 43 THEN v.Faixa6
		 WHEN @Idade > 43 AND @Idade <= 48 THEN v.Faixa7
		 WHEN @Idade > 48 AND @Idade <= 53 THEN v.Faixa8
		 WHEN @Idade > 53 AND @Idade <= 58 THEN v.Faixa9
		 WHEN @Idade > 58 THEN v.Faixa10
	END
) AS DsAttributeValueName
,v.TaxaDeIngresso
FROM (SELECT Max(u.CodFlowExecute) CodFlowExecute, u.Codigo FROM wfUNIMEDSM_TABELA_DE_VENDAS u WITH (NOLOCK) GROUP BY u.Codigo) AS uu
INNER JOIN wfUNIMEDSM_TABELA_DE_VENDAS v WITH (NOLOCK) ON uu.CodFlowExecute = v.CodFlowExecute
WHERE 
v.TipoDePlano = '{Formulario.tipoDeContratacao}'
AND v.Codigo = '{Formulario.produto}'
ORDER BY CodAttributeCustomValue

-- ############################# - FIM SCRIPT - #############################
