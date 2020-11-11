<?php

namespace Controller;

use Exception;
use Models\Conect;
use Models\Request_m;
use PDO;

class Api extends Request_m{
   
    public function __construct($rota)
    {
        parent::__construct();
        $this->rota = $rota;       
    }

    public function cadastro_pessoa(){ 
        $db = Conect::abreConexao();
        $db->beginTransaction();     
        try{
            
            $json_transacao  =  json_decode($this->josn,true);   
            $retorno = null;
            $add_pessoa = $db->prepare('INSERT INTO pessoas (nome) value(:nome)');
            $add_pessoa->bindValue(':nome',$json_transacao['nome'], PDO::PARAM_STR);
            $add_pessoa->execute();  
            $id_pessoa = $db->lastInsertId(); 
            $value_contato = false;
            foreach ($json_transacao['contato'] as $key => $value) {               
                if(!$value_contato){$value_contato = "({$id_pessoa},'{$key}','{$value}')";}
                else{$value_contato .= ",({$id_pessoa},'{$key}','{$value}')";}                
            }   
                         
            $db->exec("INSERT INTO pessoas_contato (id_pessoa,nome_contato,contato) values{$value_contato}");        

            $db->commit();
            $retorno = ['Sucesso'=>'Cadastro realizado'];
        }catch (\Throwable $e) {
            $db->rollBack();
            $retorno = ['Erro'=>$e->getMessage()];
        }finally{
            $this->resposta->setData($retorno);
            $this->resposta->send();
        }
    }  
    
    public function remove_pessoa($data){ 
        $db = Conect::abreConexao();
        $db->beginTransaction();     
        try{  
            if(is_numeric($data['id_pessoa'])){
                $db->exec("DELETE FROM pessoas WHERE pessoas.id = ".$data['id_pessoa']);
            }else{
                throw new Exception('Erro do id pessoa');
            }
            $db->commit();
            $retorno = ['Sucesso'=>'Pessoa removido com sucesso'];
        }catch (\Throwable $e) {
            $db->rollBack();
            $retorno = ['Erro'=>$e->getMessage()];
        }finally{
            $this->resposta->setData($retorno);
            $this->resposta->send();
        }
    } 
    
    public function altera_pessoa(){ 
        $db = Conect::abreConexao();
        $db->beginTransaction();     
        try{
            
            $json_transacao  =  json_decode($this->josn,true);   
            $retorno = null;
            $at_pessoa = $db->prepare('UPDATE pessoas SET nome = :nome WHERE pessoas.id = :id_pessoa');
            $at_pessoa->bindParam(':id_pessoa',$json_transacao['id'], PDO::PARAM_INT,5);            
            $at_pessoa->bindParam(':nome',$json_transacao['nome'], PDO::PARAM_STR);
            $at_pessoa->execute();  
            $value_contato = false;
            

            foreach ($json_transacao['contato'] as $key => $value) {  
                if(!isset($value[$key]['id'])){
                    if(!$value_contato){$value_contato = "(".$json_transacao['id'].",'".$value[$key]['nome_contato']."','".$value[$key]['contato']."')";}
                    else{$value_contato .= ",(".$json_transacao['id'].",'".$value[$key]['nome_contato']."','".$value[$key]['contato']."')";}  
                }else{
                    $db->exec("UPDATE pessoas_contato SET nome_contato = '".$value[$key]['nome_contato']."',
                                contato = '".$value[$key]['contato']."' WHERE pessoas_contato.id = ".$value[$key]['id']);
                }         
                              
            }   
            if($value_contato){
                $db->exec("INSERT INTO pessoas_contato (id_pessoa,nome_contato,contato) values{$value_contato}"); 
            }                 

            $db->commit();
            $retorno = ['Sucesso'=>'Alteração realizado'];
        }catch (\Throwable $e) {
            $db->rollBack();
            $retorno = ['Erro'=>$e->getMessage()];
        }finally{
            $this->resposta->setData($retorno);
            $this->resposta->send();
        }
    } 

    public function remove_contato($data){ 
        $db = Conect::abreConexao();
        $db->beginTransaction();     
        try{  
            if(is_numeric($data['id_contato'])){
                $db->exec("DELETE FROM pessoas_contato WHERE pessoas_contato.id = ".$data['id_contato']);
            }else{
                throw new Exception('Erro do id contato');
            }
            $db->commit();
            $retorno = ['Sucesso'=>'Conato removido com sucesso'];
        }catch (\Throwable $e) {
            $db->rollBack();
            $retorno = ['Erro'=>$e->getMessage()];
        }finally{
            $this->resposta->setData($retorno);
            $this->resposta->send();
        }
    } 

    public function lista_pessoas($data){ 
        $db = Conect::abreConexao();  
        (isset($data['id_pessoa']))?
            $parametro_query =  " WHERE pessoas.id = ".$data['id_pessoa']
            : $parametro_query = '';    
        $co_pessoa = $db->prepare("SELECT pessoas.id,
                                        pessoas.nome,
                                        GROUP_CONCAT(DISTINCT CONCAT(pessoas_contato.nome_contato, ': ', pessoas_contato.contato)) lista_contatos
                                    FROM pessoas
                                        INNER JOIN pessoas_contato ON pessoas_contato.id_pessoa = pessoas.id
                                    ".$parametro_query." 
                                    GROUP BY pessoas.id
                                ");
        $co_pessoa->execute();  
        $retorno = $co_pessoa->fetchAll();
    
        $this->resposta->setData($retorno);
        $this->resposta->send();
    
    } 
    
     
}
?>
