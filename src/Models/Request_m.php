<?php
namespace Models;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class Request_m{
    protected $request;
    protected $reposta; 
    protected $josn;
   
    public function __construct()
    {   
       $this->request = Request::createFromGlobals();     
       $this->josn = $this->request->getContent();
       $this->resposta = new JsonResponse();
       
       
    }   
}
?>