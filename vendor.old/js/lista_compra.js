
$(window).on ('load', function(){
    $('#carregando').hide();
    if($(".remover_item").length){        
        $(".confirmar_item").show();
    }
    if(localStorage.getItem('situacao')){  
        $("input[par='"+localStorage.getItem('situacao')+"']").next().trigger('click'); 
        localStorage.setItem('situacao','A');
    }else{
        $("input[par='A']").next().trigger('click'); 
    }
});

$(document).on('click','.remover_item',function(){
    var seletor = $(this);
    var url = seletor.attr('action');
    var chave_itens = seletor.attr('remove').split(',');
    $.confirm({
        title: '<i class="fas fa-exclamation-triangle"></i> <small>Atenção!!!</small>',
        content: 'Confirmar exclusão?',
        buttons: {
            confirm: {                
                text: 'OK',
                btnClass: 'btn-dark',
                action: function () {
                    $.ajax({
                        type:"POST",
                        url: url,
                        data:{
                            uuid:chave_itens[4],
                            cliente:chave_itens[1],
                            id_produto:chave_itens[2],
                            tamanho:chave_itens[2]            
                        },success:function(msg){   
                            if(seletor.attr('tipo')=='vendedor'){                             
                                seletor.parent().parent().parent().find("div[class='card'").remove();
                                seletor.parent().parent().remove();
                                recarrega_pagina = true;
                            }else{
                                location.reload();
                            }
                        },error:function(){
                            $.alert('Erro no sistema para efetivar a exclusão, tente novamente e caso o problema permaneça avise o Vendedor. Obrigado!!')
                        }
                    })}
            },
            cancel: {                
                text: 'Cancelar'
            }
        }
    });    
});

$(document).on('click','.confirmar_item',function(){
    var seletor = $(this);
    var url = seletor.attr('action');
    var cod = seletor.attr('cod');
   
    $.confirm({
        title: '<i class="fas fa-exclamation-triangle"></i> <small>Atenção!!!</small>',
        content: 'Nosso vendedor entrará em contato para que seja realizado o pagamento.<br />Podemos confirmar seu pedido?<br />',
        buttons: {
            confirm: {                
                text: 'Sim',
                btnClass: 'btn-dark',
                action: function () {
                    $.ajax({
                        type:"POST",
                        url: url,
                        data:{
                            cod:cod           
                        },success:function(data){
                            if(data>0){
                            location.reload();
                            }
                        },error:function(){
                            $.alert('Erro no sistema para confirmar pedido, tente novamente e caso o problema permaneça avise o Vendedor. Obrigado!!')
                        }
                    })}
            },
            cancel: {                
                text: 'Não'
            }
        }
    });    
});

var recarrega_pagina = false;
$(document).on("change","input[type='checkbox']", function(){
    $("input[type='checkbox']").each(function(){        
        if($(this).is(":checked") == true){
            $(this).next().trigger('click');
        }
    });    
    if($(this).is(":checked") == true){
        $("."+$(this).attr('par')).show('slow');
        if(recarrega_pagina == true){
            localStorage.setItem('situacao',$(this).attr('par'));      
            location.reload();
            recarrega_pagina = false;        }
    }else{
        $("."+$(this).attr('par')).hide('slow');
    }
})

$(document).on('click','.altera_situacao',function(){
    var seletor = $(this);
    var url = endereco_site+"situacao/vendedor";
    var situacao = seletor.attr('par');
    var cod = seletor.attr('cod');
    var texto =  seletor.text().trim();    
    var cor = '';
    switch (situacao) {
        case 'A': cor = "class='text-danger'";      
            break;    
        case 'C': cor = "class='text-success'";      
            break;
        case 'P': cor = "class='text-info'";      
            break;
        case 'E': cor = "class='text-secondary'";      
            break;
    }
    $.confirm({
        title: '<i class="fas fa-exclamation-triangle"></i> <small>Atenção!!!</small>',
        content: "Você está alterando a situação desse produto para <b "+cor+">"+texto+"</b>.<br />Comfirmar alteração?<br />",
        buttons: {
            confirm: {                
                text: 'Sim',
                btnClass: 'btn-dark',
                action: function () {
                    $.ajax({
                        type:"POST",
                        url: url,
                        data:{
                            cod:cod,
                            situacao:situacao         
                        },success:function(data){
                            if(data>0){                                      
                            seletor.parent().parent().parent().parent().find("div[class='card'").remove();
                            seletor.parent().parent().parent().remove();                      
                            recarrega_pagina = true;
                            //location.reload();
                            }
                        },error:function(){
                            $.alert('Erro no sistema para confirmar pedido, tente novamente e caso o problema permaneça avise o Vendedor. Obrigado!!')
                        }
                    })}
            },
            cancel: {                
                text: 'Não'
            }
        }
    });
});
