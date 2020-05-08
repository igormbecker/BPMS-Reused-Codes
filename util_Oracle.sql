--SCRIPT PARA DELETAR TAREFAS FANTASMAS DO PROCESSO (ORACLE)

--SELECT PARA LISTAR TODAS TAREFAS DO PROCESSO
SELECT DsTaskTitle, CodTask, CodTaskType FROM WFTASK T1
WHERE
T1.CodFlow = (SELECT T2.CodFlow FROM WFFLOW T2 WHERE DsFlowName = 'Nome do Processo')
ORDER BY T1.DsTaskTitle;

--SELECT PARA IDENTIFICAR OS ELEMENTOS DO PROCESSO POR UMA POSIÇAO
SELECT * FROM WFFLOW_ELEMENT w02
INNER JOIN WFTASK w01 ON w01.CodFlowElement = w02.CodFlowElement
WHERE 
w02.CodFlow = (SELECT T2.CodFlow FROM WFFLOW T2 WHERE DsFlowName = 'Nome do Processo')
ORDER BY NBPOSY;


DECLARE 
V_CODTASK NUMBER(10,0);
V_CODFLOWELEMENT NUMBER(10,0);

BEGIN

SELECT CodTask, CodFlowElement 
INTO V_CODTASK, V_CODFLOWELEMENT 
FROM wfTASK T1
WHERE 
ROWNUM = 1 
AND T1.CodFlow = (SELECT T2.CodFlow FROM WFFLOW T2 WHERE DsFlowName = 'UNIMED POA - Contratos Assistenciais e Complementares PF e PME')
AND T1.DsTaskTitle = 'Nome da Tafefa';
--SELECT CodFlowElement INTO V_CODFLOWELEMENT FROM wfTASK WHERE codtask = V_CODTASK;
--V_CODTASK := 1344;

DELETE FROM wfMESSAGE WHERE CodTask = V_CODTASK;
DELETE FROM wfTASK_POSITION WHERE CodTask = V_CODTASK;
DELETE FROM wfFLOW_EXECUTE_SEQUENCE WHERE CodTaskFrom = V_CODTASK OR CodTaskTo = V_CODTASK OR CodFlowElement = V_CODFLOWELEMENT;
DELETE FROM wfFLOW_EXECUTE_TASK WHERE CodTask = V_CODTASK;
DELETE FROM wfTASK_GENERAL WHERE CodTask = V_CODTASK;
DELETE FROM wfTASK_XML WHERE CodTask = V_CODTASK;
DELETE FROM wfTASK WHERE CodTask = V_CODTASK;
DELETE FROM wfFLOW_ELEMENT WHERE CodFlowElement = V_CODFLOWELEMENT;
COMMIT;

END;
-- ############################# - FIM SCRIPT - #############################



--ATUALIZA A URL DAS FONTES DE DADOS IMPORTADAS PARA A URL DO AMBIENTE ATUAL.
--CRIA UMA TABELA DE BACKUP DA TABELA WFGROUP_VALUE
CREATE TABLE WFGROUP_VALUE_BKP_06032020_SML AS SELECT 
CODGROUPVALUE
,DSGROUPVALUENAME
,CODDATA
,DSSOURCE
,CODDATACONNECTION
,DSTYPE
,DSFILENAME
,DSLOCATION
,DSMETHOD
,DSNETWORKUSERNAME
,DSNETWORKPASSWORD
,VLCACHE
,DSPARAMETERS
,DSPARAMETERS2
,DSPARAMETERS3
,DSVALUEID
,DSTEXTID
,DSFILTEREXPRESSION
,DSSOAPACTION
,DSORDERID
,DSINCASEISNULL
,DSFIELDMAPPING
,STENABLEANONYMOUS
,DSHEADERS
,DSERROREXP
,DSERRORMSGEXP
,DSDESCRIPTION
,CODGROUPVALUEUID
,DSPROXY
FROM WFGROUP_VALUE; 
COMMIT;


SET SERVEROUTPUT ON
DECLARE
  NewDsFileName VARCHAR2(512 BYTE) null;
  NewDsLocation VARCHAR2(512 BYTE) null;
  CheckExists NUMBER;
  
BEGIN
  --FAZ UM SELECT APENAS FONTES DE DADOS DO TIPO WSDL.
  FOR Fonte IN (SELECT * FROM WFGROUP_VALUE WHERE DsType = 'wsdl') LOOP
  
            --VERIFICA SE EXISTE O PREFIXO "http://perth01-dev:88" NA URL DA FONTE DE DADOS E SALVA O RESULTADO NA VARIAVEL "CheckExists".
            BEGIN
            SELECT INSTR(DsFileName, 'http://perth01-hml:88', 1)
            into CheckExists 
            FROM WFGROUP_VALUE 
            WHERE 
            CodGroupValue = Fonte.CodGroupValue;
            
            --SE "CheckExists" > 0 = Existe.
            IF CheckExists > 0 THEN  
                 --FAZ UM SELECT REMOVENDO O PREFIXO "http://perth01-hml:88" do DsFileName.
                 SELECT REPLACE(DsFileName, 'http://perth01-hml:88', 'https://orquestra.unimedpoa.com.br')
                 into NewDsFileName
                 FROM WFGROUP_VALUE
                 WHERE
                 CodGroupValue = Fonte.CodGroupValue; 
                 
                 --FAZ UM SELECT REMOVENDO O PREFIXO "http://perth01-hml:88" do DsLocation.
                 SELECT REPLACE(DsLocation, 'http://perth01-hml:88', 'https://orquestra.unimedpoa.com.br')
                 into NewDsLocation
                 FROM WFGROUP_VALUE
                 WHERE
                 CodGroupValue = Fonte.CodGroupValue; 
                 
                UPDATE WFGROUP_VALUE SET 
                DsFileName = NewDsFileName, 
                DsLocation = NewDsLocation
                WHERE 
                CodGroupValue = Fonte.CodGroupValue;
                COMMIT;
                 
                 DBMS_OUTPUT.PUT_LINE('Fonte de dados: ' || Fonte.DsGroupValueName || ', Atualizada!');
            END IF;
            
            EXCEPTION
            WHEN NO_DATA_FOUND THEN
                DBMS_OUTPUT.PUT_LINE('Fonte de Dados Não Encontrada: ' || Fonte.DsGroupValueName);
                goto end_loop;
            END;
            
            <<end_loop>>
            NewDsFileName := null;
            NewDsLocation := null;
    end loop; 
END;


-- ############################# - FIM SCRIPT - #############################




