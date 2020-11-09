$(document).ready(function(){
    $("#carregando").fadeOut('fast'); 
});

function adiciona_item(selector){
    $.ajax({
        type: "POST",
        async: false,
        url: selector.attr('action'),
        data: selector.serialize(),
        error: function(){
            console.log(a);
            alert('Erro ao adicionar item');
        }
    }).done(function(data){
        if(data.lastIndexOf('sucesso') != -1){
            /*if(data != 'sucesso'){$.post("pagina_notificacao_erro.php", { erro:window.location.href+data+"  Produto - id_cliente "+$("input[name='id_cliente']").val()+" id_produto "+$("input[name='id_produto']").val()});}
            $("#localInformacaoProduto").html("<div class='mt-1 col-sm-12 justify-content-center'><p style='color:green'><b>Produto adicionado com sucesso!!!</b></p>"+
                                                "<a href='' class='btn btn-primary btn-sm btn-block' ><b>ITENS SELECIONADO</b></a><br />"+
                                                "<button type='button' class='btn btn-block btn-sm btn-primary' data-dismiss='modal'><b>CONTINUAR COMPRANDO</b></button></div>");*/                     
        }else{
            /*$.post("pagina_notificacao_erro.php", { erro:data+' dados enviados: '+$("#form_add").serialize()});
            */$("#localInformacaoProduto").html("<div class='mt-1 col-sm-12 justify-content-center'>"+
                                                " <div class='alert alert-danger' role='alert'>Houve um problema para adicionar o produto, Clique em continuar e tenta adicionar novamente."+
                                                " Caso o erro percista, informe a administração do sistema.<br />Obrigado</div> "+
                                                "<button type='button' class='btn btn-block btn-sm btn-primary' data-dismiss='modal'><b>CONTINUAR COMPRANDO</b></button></div>");
        }
    }); 
}
 /*adiciona os campos INPUT nos filtros da tela */
 var visualizaFiltro = {'pesquisa':false};
/*Envio do formularia de pesquisa */
$(document).on("submit","#form_pesquisa_us", function(e) {
    if($("input[name='pesquisa']").val() == ''){
        $("input[name='pesquisa']").focus();
        return false
    }    
    $('#form').find('#limpar').trigger('click');
    $("#carrega").html('');
    $("#carregando").fadeIn('fast'); 
    e.preventDefault();
    $("input[name='num_pagina']").val('0');
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),         
        /*dataType: "json",*/
        error: function(data,fator,erro){
            alert(data+fator+erro);
        },        
        complete: function(){
            $("#carregando").fadeOut('fast');
        }
    }).done(function(data){
        $("#carrega").html(data);
        visualizaFiltro['pesquisa'] = true;$(".filtros_tela").find("p[par='pesquisa']").find('b').html($("input[name='pesquisa']").val());
        $(".filtros_tela").find("p[par='pesquisa']").css("display", "block");
        $.each($("#ordena_busca").find('a'), function (index, value) {
            $(this).removeClass('ordenar_pagina_filtro').addClass('ordenar_pagina_filtro_busca');
        });
    });    
    return false;
});

/*Paginação 
$(document).on('click','.paginacao',function(){ 
    var pagina = $(this).attr('parametro');
    var paginaRemove = pagina-8;
    var url_envio = $("#form_pesquisa_us").attr('action');
    var dados = $("#form_pesquisa_us").serialize();
    $("input[name='num_pagina']").val(pagina);  
    $("#carregando").fadeIn('fast'); 
    $("#paginacao").remove();
    if(url_envio){
        $.ajax({
            type: "POST",
            url: url_envio,
            data: dados, 
            complete: function(){$("#carregando").fadeOut('fast');$("div[piscao_num='"+paginaRemove+"']").remove()},
            error: function(){alert('Erro para carregar páginas')}
        }).done(function(data){$("#carrega").append(data);}); 
    }else{
        $("#carregando").fadeOut('fast');
    }   
});*/

 /*dispara o botao para carregar mais itens, quando chega no final da tala
 $(window).scroll(function(){           
    if($(window).scrollTop() + window.innerHeight+500 >= $(document).height()){
        $("#paginacao").find("a").trigger('click');
    };
 });*/
  /*botao limpar apenas um item do filtro*/
 function limparbusca(){       
    $("input[name='pesquisa']").val(''); 
    $(this).closest('p').css("display", "none");
    $('#num_pagina').val('0'); 
    visualizaFiltro['pesquisa'] = false;
 }

 /*ao clicar em um item salva a pagina, para voltar na pagina*/
 $(document).on('click',".carrega_produto", function(){ 
    url = '';
    $("#carrega_produto").empty();
    $("#carrega_produto").html($("#carregando").html());    
    var local_produto = $(this).attr("paramentro");
    $.get(local_produto,{ tela:1 } )
        .done(function (data) {
        
        $("#carrega_produto").html(data);   
    }); 
    tamanhos_compra = [];     
    $("#modal_produto").modal('show'); 
    
    const stateObj = { foo: "produto" };
    history.pushState(stateObj, "modal open", location.href);    

    return false;
 });

 window.onpopstate = function(event) {

    $("#modal_produto").modal("hide");
}

 //adiciona tamanho no vetor tamanho 
 var tamanhos_compra = [];    
 $(document).on('click','.adiciona-tamanho', function(){ 
    tamanhos_compra = [];     
    tamanhos_compra.push($(this).text(),'1');
    $(".adiciona-tamanho").css({'background-color':'white','color':'black'}); 
    $(this).css({'background-color':'black','color':'white'});        
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

    if(sessionStorage.getItem('CODI_CLIENTE')){
        selector.find("input[name='cliente2']").val(sessionStorage.getItem('DADOS_CLIENTE'));   
        selector.find("input[name='id_usuario_final']").val(sessionStorage.getItem('CODI_CLIENTE'));  
        adiciona_item(selector);
        setTimeout(function(){ 
            $(window.document.location).attr('href',$("#carrinho_compra").attr('href')); 
        }, 2000);   
        return false;
    }  
    const stateObj = { foo: "lista" };
    history.replaceState(stateObj, "modal close", location.href);
    $("#modal_produto").modal('hide');  
    $.confirm({
        columnClass: 'col-md-12',
        title: '<i class="fas fa-exclamation-triangle"></i> <small>COLOQUE SEU NOME E TELEFONE <small>(Whatsapp)</small><br />'+ 
                'Entrarei em contato para confirmar seus dados.<br />Boa Compra!</small>',
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
                        $.post(endereco_site+"usuario_final_valida", { nome: nome, telefone: telefone, cod_url:cod_url}).done(function(data_retorno){
                            var info_usuario = JSON.parse(data_retorno);   
                            if(info_usuario['erro']){     
                                $.alert("<div class='alert alert-danger' role='alert'><i class='fas fa-exclamation-triangle'></i> <b>Erro!</b></div>"+info_usuario['erro']);                               
                                $("#carrega_produto").find("#localAdicionar").html(botao_enviar);
                            }else{
                                selector.find("input[name='id_usuario_final']").val(info_usuario['ID_CADASTRO']); 
                                selector.find("input[name='cliente2']").val(info_usuario['NOME']+" - Tel: "+info_usuario['TELEFONE']);      
                                sessionStorage.setItem('CODI_CLIENTE', info_usuario['ID_CADASTRO']);   
                                sessionStorage.setItem('DADOS_CLIENTE', (info_usuario['NOME']+" - Tel: "+info_usuario['TELEFONE']));               
                                adiciona_item(selector);
                                tamanhos_compra = [];
                                $("#grade_json").val("");
                                $("#carrinho_compra").attr("href", endereco_site+"lista/"+sessionStorage.getItem('CODI_CLIENTE')+"/"+cod_url);
                                $(window.document.location).attr('href',$("#carrinho_compra").attr('href'));    
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

//Ordenar por
$(document).on("click",".ordenar_pagina_filtro", function () {
    $("#carrega").html("");
    $("#ordenar").val($(this).attr("parametro"));
    visualizaFiltro["ordena"] = true;
    $(".filtros_tela").find("p[par='ordena']").find("b").html($(this).text());
    $("#form").trigger("submit");
  });

  //Ordenar por
$(document).on("click",".ordenar_pagina_filtro_busca", function () {
    $("#carrega").html("");
    $("input[id='ordenar_pesquisa']").val($(this).attr("parametro"));
    visualizaFiltro["ordena"] = true;
    $(".filtros_tela").find("p[par='ordena']").find("b").html($(this).text());
    $("#form_pesquisa_us").trigger("submit");
  });

$(document).on("click","#envia_form", function(){
    $.each($("#ordena_busca").find('a'), function (index, value) {
        $(this).removeClass('ordenar_pagina_filtro_busca').addClass('ordenar_pagina_filtro');
    });   
    limparbusca();
    $('#form').trigger('submit');
    if ($('body').is(".control-sidebar-slide-open")) {
        $('#abre_filtros').trigger('click');
    }   
});

$(document).on('click','.verifica_tela_vazia',function(){
    setTimeout(function(){ 
        if($("#carrega").text() == ''){$("#form").trigger("submit");}
    }, 7000);
});

/*pequisa utiliza no computador */
$(document).on('input','#pesquisa_barra_sup', function(){
    $("input[name='pesquisa']").val($(this).val());
});


$(document).on('keypress','input',function(e) {
    if(e.which == '13'){
        if($(this).attr('par_formulario') == 'form'){
            $("#envia_form").trigger('click');
        }
        if($(this).attr('par_formulario') == 'form_pesquisa_us'){
            $('#form_pesquisa_us').trigger('submit')
        }
    }
});
