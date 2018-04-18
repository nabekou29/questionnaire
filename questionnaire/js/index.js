$(function () {
  let indexNo = 0;
  $('button').on('click', function () {
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
})
