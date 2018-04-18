$(function () {
  let indexNo = 0;
  $('button').on('click', function () {
    // 名前をクッキーに保存
    let name = $("input[name='name']").val();
    $.cookie("name", name);

    $(`div[data-index='${indexNo}']`).fadeOut("slow", function () {
      indexNo += 1;
      $(`div[data-index='${indexNo}']`).fadeIn("slow");
    });
  });

  $('img').on('click', function () {
    let value = $(this).data("value");
    $(`div[data-index='${indexNo}'] input`).val(value);

    $(`div[data-index='${indexNo}']`).fadeOut("slow", function () {
      indexNo += 1;
      $(`div[data-index='${indexNo}']`).fadeIn("slow");
    });
  });

  $("button#submit-button").on('click', function () {
    let url = $(this).data('action');
    let data = $('form').serializeArray();

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(data)
    }).done((data) => {
      console.log(data);
      $('button#submit-button').attr('disabled', true);
    }).fail((data) => {
      console.log('error');
    });

    return false;
  });
})
