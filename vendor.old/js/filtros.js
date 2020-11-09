//autocompleta da preferencia
$("#referencia_completa").autocomplete({
    minLength: 2,
    autoFocus: true,
    delay: 200,
    source: function (request, response) {
      $.ajax({
        type: "POST",
        url: enderco_mobile+"index_carrega.php",
        data: [
          $("#form").serialize(),
          $.param({ pesquisa: $("#referencia_completa").val() }),
        ].join("&"),
      }).done(function (data) {
        data = data.split(",");
        response(
          $.each(data, function (key, item) {
            return { label: item };
          })
        );
      });
    },
  });