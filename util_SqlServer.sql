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


