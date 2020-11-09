$(document).ready(function(){
    $("#limpar").on('click',function(){
        $("input").val('');
        $("input[type='checkbox']").attr("checked", false);
    });  
});

$(document).on("click","#gera_link", function(){
    var json_pesquisa = $("input[name='seq_link']").val();
    var local = $("input[name='local_link']").val();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: local,
        data: $("#form").serialize(), 
        success: function(data){  
            $(".link_social").each(function(){
                $(this).attr('data-param-text',data['link']);                    
                $(this).attr('data-param-url',data['link']);
            });       
            $("#carrega_conteudo_modal").html($('#compartilha_link').html());
            $("#carrega_conteudo_modal").find("#copiaurl").val(data['link']);
            $("#modal_").modal('show'); 
        },
        error: function(){alert('Erro para carregar páginas')}
    });
});

$("#gera_pdf").on("click", function (){
    var json_pesquisa = $("input[name='seq_link']").val();
    var local = $("input[name='local_link']").val();
    $.ajax({
        type: "POST",
        async: false,
        dataType: "json",
        url: local,
        data: $("#form").serialize(), 
        error: function(){alert('Erro para carregar páginas')}
    }).done(function(data){              
        window.open(data['link'].replace(/\/lk\//g , "\/lkpdf\/"),"_blank");
    });
}); 


 /*ao clicar em um item salva a pagina, para voltar na pagina*/
 $(document).on('click',".carrega_produto", function(){ 
    url = '';
    tamanhos_compra = [];
    $("#carrega_produto").empty();
    $("#carrega_produto").html($("#carregando").html());    
    var local_produto = $(this).attr("paramentro");
    $.get(local_produto,{ tela:1 } )
    .done(function(data) {
        $("#carrega_produto").html(data);   
    });
    $("#modal_produto").modal('show');      
    return false;
 });

 //adiciona tamanho no vetor tamanho 
 var tamanhos_compra = [];    
 $(document).on('click','.adiciona-tamanho', function(){ 
    tamanhos_compra = [];     
    tamanhos_compra.push($(this).text(),'1');
    $(".adiciona-tamanho").css({'background-color':'white','color':'black'}); 
    $(this).css({'background-color':'black','color':'white'});      
    $("#grade_json").val("["+JSON.stringify(tamanhos_compra)+"]");     
 });


 //envio do formulária para adicionar item
 $(document).on('submit','.form_produto_add', function(e){
    e.preventDefault();     
    var cod_url = $("input[name='cod_url']").val();
    var selector =  $(this);

    if(tamanhos_compra.length == 0){
        $.alert('Selecione uma numeração');
        return false;
    }
    $("#grade_json").val("["+JSON.stringify(tamanhos_compra)+"]");
    var botao_enviar = $("#localAdicionar").html();
    $("#localAdicionar").html($("#carregando").html());

    $("#modal_produto").modal('hide');  
    $.confirm({
        columnClass: 'col-md-12',
        title: '<i class="fas fa-exclamation-triangle"></i> <small>Nome e Telefone <small>(Whatsapp)</small><br />Nome e telefone para identificação do cliente.</small>',
        type: 'dark',
        typeAnimated: true,
        content: '' +        
        '<div class="form-group">' +
        '<input type="text" id="nome" name="nome" placeholder="Seu nome" class="form-control" required />' +
        '</div>' +
        '<div class="form-group">' +
        '<input type="text" id="telefone" name="telefone" placeholder="Telefone (xx) xxxxx-xxxx" class=" formata_valor form-control" required />' +
        '</div>',
        buttons: {
            formSubmit: {
                text: 'Enviar',
                btnClass: 'btn-dark',
                action: function () {
                    var nome = this.$content.find('#nome').val();                    
                    var telefone = this.$content.find('#telefone').val();
                    if(!nome || !telefone){
                        $.alert('Nome ou telefone está com preenchimento incorreto');
                        return false;
                    }else{
                        $.post(endereco_site+"usuario_final_valida_vendedor", { nome: nome, telefone: telefone, cod_url:cod_url}).done(function(data_retorno){
                            var info_usuario = JSON.parse(data_retorno);   
                            if(info_usuario['erro']){     
                                $.alert("<div class='alert alert-danger' role='alert'><i class='fas fa-exclamation-triangle'></i> <b>Erro!</b></div>"+info_usuario['erro']);                               
                                $("#carrega_produto").find("#localAdicionar").html(botao_enviar);
                            }else{
                                selector.find("input[name='id_usuario_final']").val(info_usuario['ID_CADASTRO']); 
                                selector.find("input[name='cliente2']").val(info_usuario['NOME']+" - Tel: "+info_usuario['TELEFONE']);  
                                $.ajax({
                                    type: "POST",
                                    url: selector.attr('action'),
                                    data: selector.serialize(), 
                                    success: function(data){
                                        if(data.lastIndexOf('sucesso') != -1){
                                            /*if(data != 'sucesso'){$.post("pagina_notificacao_erro.php", { erro:window.location.href+data+"  Produto - id_cliente "+$("input[name='id_cliente']").val()+" id_produto "+$("input[name='id_produto']").val()});}
                                            */$("#localInformacaoProduto").html("<div class='mt-1 col-sm-12 justify-content-center'><p style='color:green'><b>Produto adicionado com sucesso!!!</b></p>"+
                                                                                "<button type='button' class='btn btn-block btn-sm btn-primary' data-dismiss='modal'><b>CONTINUAR COMPRANDO</b></button></div>");                     
                                        }else{ alert(selector.serialize());
                                            /*$.post("pagina_notificacao_erro.php", { erro:data+' dados enviados: '+$("#form_add").serialize()});
                                            */$("#localInformacaoProduto").html("<div class='mt-1 col-sm-12 justify-content-center'>"+
                                                                                " <div class='alert alert-danger' role='alert'>Houve um problema para adicionar o produto, Clique em continuar e tenta adicionar novamente."+
                                                                                " Caso o erro percista, informe a administração do sistema.<br />Obrigado</div> "+
                                                                                "<button type='button' class='btn btn-block btn-sm btn-primary' data-dismiss='modal'><b>CONTINUAR COMPRANDO</b></button></div>");
                                        }
                                    },
                                    error: function(){
                                        alert('Erro ao adicionar item');
                                    }
                                }); 
                                tamanhos_compra = [];
                                $("#grade_json").val("");   
                            }
                        });                       
                        $("#modal_produto").modal('show'); 
                    }
                    
                }
            },
            cancel:{text: 'Cancelar'}
        }
    });
    return false;
});


/*dispara o botao para carregar mais itens, quando chega no final da tala*/
$(window).scroll(function () {
    if(($('#gera_pdf').offset().top - $(window).scrollTop()) < 1){
        $("#div-botao-pdf").show('slow');
    }else{
        $("#div-botao-pdf").hide('slow');  
    }
  });

