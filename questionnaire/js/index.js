$(function () {
  let indexNo = 0;

  $("input[name='name']").val($.cookie("name"));

  $(document).on('keypress', 'input:not(.allow_submit)', function (event) {
    return event.which !== 13;
  });

  $("button.start").one('click', function () {
    // 名前をクッキーに保存
    let name = $("input[name='name']").val();
    $.cookie("name", name);

    showNextForm(indexNo);
    indexNo += 1;
  });

  $('img').one('click', function () {
    let value = $(this).data("value");
    $(`div[data-index='${indexNo}'] input`).val(value);

    showNextForm(indexNo);
    indexNo += 1;
  });

  $("button#submit-button").one('click', function () {
    showNextForm(indexNo);
    indexNo += 1;

    let url = $(this).data('action');

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: createJson()
    }).done((data) => {
      console.log(data);
    }).fail((data) => {
      console.log('error');
      console.log(data);
    });

    return false;
  });
})

/**
 * 次のフォームに切り替える
 * @param {number} indexNo フォーム番号
 */
function showNextForm(indexNo) {
  $(`div[data-index='${indexNo}']`).fadeOut("slow", function () {
    $(`div[data-index='${indexNo + 1}']`).fadeIn("slow");
  });
}

/**
 * フォームの値をJSON形式に変化する
 */
function createJson() {
  let data = {
    name: $("[name='name']").val(),
    q1: $("[name='q1']").val(),
    q2: $("[name='q2']").val(),
    q3: $("[name='q3']").val(),
    q4: $("[name='q4']").val(),
    q5: $("[name='q5']").val(),
    q6: $("[name='q6']").val()
  };

  return JSON.stringify(data);
}
