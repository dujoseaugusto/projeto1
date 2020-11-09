$(document).ready(function(){ 
  window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);

  if($('#numero_de_regras').val() > 1){
    $(".configuracao_simples").trigger('click');
  }

  $(".format_monetario").each(function(index, value){
    $(this).trigger("input");
  });
 
});

$(window).resize(function(){
  $(".format_monetario").each(function(index, value){
    $(this).trigger("input");
  });
})

$(document).on('click', '#pills-lucro', function(){
  setTimeout(function(){
    $(".format_monetario").each(function(index, value){
      $(this).trigger("input");
    });
  }, 500);
});


/*Simulação do cadstro valores da margem de lucro*/
$(document).on('click',".simulacao", function(){   
  $("#carrega_conteudo_modal").html($("#simulacao_conf").html());
  $("#modal_").modal('show');     
});

$(document).on("keyup","#simula_valor_produto", function(){  
  var jsonvalores = jQuery.parseJSON($("#json_regras").val());    
  var valor = $(this).val().replace(/[^\d]+/g,'');  
  var tipo = '';
  var valor_calculo = 0;  
  if(valor > 0){
    valor_decimal = valor/100;
  }
  $.each(jsonvalores, function(key,value){
    if(valor_decimal >= value['valor_ini']){
      tipo = value['tipo_lucro'];
      valor_calculo = value['valor'];
    }
  })
  
  if(tipo == "$"){$(this).prev().html("<b>Margem de lucro de R$"+parseFloat(valor_calculo).toFixed(2)+"</b>");}
  else{$(this).prev().html("<b>Margem de lucro de "+parseFloat(valor_calculo).toFixed(1)+"%</b>");}

  if(valor < 999){valor = ("000" + valor).slice(-3);}
  var retorna = valor.substring(0,(valor.length-2))+","+valor.substring((valor.length-2),valor.length);
  $(this).val(retorna);  
  if(tipo == "$"){$(this).next().find('b').html((parseFloat(valor/100)+parseFloat(valor_calculo)).toFixed(2))}
  else{$(this).next().find('b').html((parseFloat(valor/100)*(1+parseFloat(valor_calculo/100))).toFixed(2))}  
});


/*Forma*/
$(document).on("input",".format_monetario", function(){
  var tamanho = $(this).attr('max') - $(this).attr('min');
  var valor_barra = parseFloat(($(this).val()*($(this).width()-16))/tamanho).toFixed(0) 
  if((($(this).attr('name') == 'valor') && ($('#op1').prop("checked"))) || ($(this).attr('name') == 'valor_ini')){        
    var valor = "R$"+((parseFloat($(this).val()).toFixed(2))).replace(".",",");    
  }else{        
    var valor = ((parseFloat($(this).val()).toFixed(1))).replace(".",",")+"%";
  }
  $(this).prev().html(valor);
  $(this).next().css("width", valor_barra+"px");
});

$(function () {
  $('#myTab li:last-child a').tab('show')
});

$(document).on("change","#imagem_logo",function(){
    if (this.files && this.files[0]){      
      var tamnho = (this.files[0].size/1024).toFixed(2);
      var img = new FileReader();
      img.onload = function(e){
        $("#img_preview").html("<img class='img-visualiza' src='"+e.target.result+"'/>");
    }
    img.readAsDataURL(this.files[0]);
  }
});


/*Configuração avançada não está sendo utiilizado*/
$(document).on("click",".botao_tag_av",function(){ 
  $(".configuracao_avancada").css('display', 'block');  
  $(".configuracao_simples").css('display', 'none');
});

$(document).on("click",".botao_tag_si",function(){ 
  $(".configuracao_avancada").css('display', 'none');  
  $(".configuracao_simples").css('display', 'block');
}); 

$(document).on('click', '#view-vizualiza', function(){
  $("#visuliza_modal").hide(); 
  $("#visuliza_modal").modal('show'); 
 // alert(endereco_site+'visualiza');return false;
  $("#visuliza_tela").load(endereco_site+'visualiza');
  });

$(document).on('click','body', function(){
  $("#visuliza_tela").html('');
});

$(document).on('change','.salva',function(){
  if($("input[name='nome']").val().length > 0){
    $.confirm({
      title: '<i class="fas fa-exclamation-triangle"></i> ',
      content: 'Salvar alteração?',
      buttons: {      
          confirm:{          
            text: 'Salvar',
            btnClass: 'btn-blue',
            keys: ['enter', 'shift'],
            action: function () {$("#form_configuracao").trigger("submit");}
          },
          cancel: function () {
              
          }
      }
    });
  }
})

$(document).on('change','.salva_valor',function(){
  $.confirm({
    title: '<i class="fas fa-exclamation-triangle"></i> ',
    content: 'Salvar alteração?',
    buttons: {      
        confirm:{          
          text: 'Salvar',
          btnClass: 'btn-blue',
          keys: ['enter', 'shift'],
          action: function () {$("#form_cadastro").trigger("submit");}
        },
        cancel: function () {
            
        }
    }
  });  
});

$(document).on("change","input[name='tipo_lucro']", function(){
  $("input[name='valor']").trigger('input');
})

