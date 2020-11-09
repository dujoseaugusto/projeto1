var contato = [];
var nome_contato = [];
function lista(){
    var html_lista = '';
    $.each(contato, function (index, value) { 
        html_lista = html_lista+"<div class='row'><div class='col-6'>"+nome_contato[index]+"</div><div class='col-6'>"+value+"</div></div>";
    });
    $('#lista').html(html_lista);
}
$(document).on('click', '#add_contato', function(){
    var contato_temp = $('#contato').val();
    var nome_contato_temp = $('#nome_contato').val()
    if(contato_temp.length > 1 && nome_contato_temp.length > 1){
        contato.push(contato_temp);
        nome_contato.push(nome_contato_temp);
    }
    lista();
})

$(document).on('click','#salvar', function(){
    var nome =  $("#nome").val();
    var lista = {};
    if(nome){
        $.each(contato, function (index, value) { 
            lista[nome_contato[index]] = value;
        });
        var dataJSON = {
    
            "nome":nome,
            "contato": lista
        }
    
        $.ajax({
            url: "http://localhost:8080/projeto/api/cadastro_pessoa",
            method : "POST",
            contentType : 'application/json',
            dataType : 'json',
            data : JSON.stringify(dataJSON),
            success: function(data) {
                if(data.Sucesso)
                    $.alert(data.Sucesso);
                else{
                    console.log(data);
                    $.alert('Erro');
                }
            },
            error: function(error) {
                console.log("Erro", error);
            }
        });
    }
})