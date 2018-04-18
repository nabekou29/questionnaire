$(function () {
  let indexNo = 0;
  $('button').on('click', function () {
    $(`div[data-index='${indexNo}']`).hide();
    indexNo += 1;
    $(`div[data-index='${indexNo}']`).show();
  });

  $('img').on('click', function () {
    let value = $(this).data("value");
    $(`div[data-index='${indexNo}'] input`).val(value);

    $(`div[data-index='${indexNo}']`).hide();
    indexNo += 1;
    $(`div[data-index='${indexNo}']`).show();
  });
})
