<?php
ob_start();
ini_set('session.cookie_lifetime', 60);
session_start();

require_once __DIR__ . "/vendor/autoload.php";

use CoffeeCode\Router\Router;

$rotas = new Router(URL_SITE);

$rotas->namespace('Controller')->group(null);
$rotas->get("/", "Paginas:home");
$rotas->get("/valida", "Paginas:valida");
$rotas->get("/cadastro", "Paginas:cadastro");
$rotas->get("/api","Paginas:api");
$rotas->get("/erro/{coderro}","Paginas:erro");

$rotas->namespace('Controller')->group('api');
$rotas->post("/cadastro_pessoa", "Api:cadastro_pessoa");
$rotas->delete("/remove_pessoa/{id_pessoa}", "Api:remove_pessoa");
$rotas->put("/altera_pessoa", "Api:altera_pessoa");
$rotas->delete("/remove_contato/{id_contato}", "Api:remove_contato");
$rotas->get("/lista_pessoa", "Api:lista_pessoas");

$rotas->dispatch();

if($rotas->error()){
  $rotas->redirect("/erro/{$rotas->error()}");
}
  