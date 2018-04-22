$(function() {
  // 名前一覧のセレクトボックス生成
  let namesSelect = document.getElementById("names");
  getAllNames().forEach(function(name) {
    let option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    namesSelect.appendChild(option);
  });


  let dateFormat = new DateFormat("yyyy-MM-dd");
  let setDate = new Date();
  $("#to").val(dateFormat.format(setDate));
  setDate.setDate(setDate.getDate() - 7);
  $("#from").val(dateFormat.format(setDate));

  // グラフ生成のイベント登録
  $("#names, #to, #from").on('change', function() {
    let name = $(this).val();
    let from = dateFormat.parse($("#from").val());
    let to = dateFormat.parse($("#to").val());
    if (name) {
      drawGraph(name, from, to);
    }
  });
});

/**
 * グラフの描画
 */
function drawGraph(name, from, to) {
  let ctx = document.getElementById("lineChart").getContext('2d');
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  let lineChart = new Chart(ctx, {
    type: 'line',
    data: createGraphData(name, from, to),
    options: {
      scales: {
        yAxes: [{ticks: {min: 1, max: 5}}]
      }
    }
  });

  let dateFormat = new DateFormat("M/dd");
  $("#graph-title").html(`${name}さんの${dateFormat.format(from)} 〜 ${dateFormat.format(to)}の心情変化`);
}

/**
 * グラフ用のデータ作成
 */
function createGraphData(name, from, to) {
  let answers = getAnswersByName(name);
  let labels = [];
  let dataSetsTmp = getDatasetsTemplate();

  let dataIndex = 0;
  let targetDate = new Date(from.getTime());
  while (answers[dataIndex] < to) {
    dataIndex++;
  }
  let dateFormat = new DateFormat("M/dd");
  for (; targetDate.getTime() <= to.getTime(); targetDate.setDate(targetDate.getDate() + 1)) {
    labels.push(dateFormat.format(targetDate));
    let answer;
    if (dataIndex < answers.length && answers[dataIndex].date.getTime() == targetDate.getTime()) {
      answer = answers[dataIndex];
      dataIndex++;
    } else {
      answer = {q1: null, q2: null, q3: null, q4: null, q5: null};
    }
    dataSetsTmp.q1.data.push(answer.q1);
    dataSetsTmp.q2.data.push(answer.q2);
    dataSetsTmp.q3.data.push(answer.q3);
    dataSetsTmp.q4.data.push(answer.q4);
    dataSetsTmp.q5.data.push(answer.q5);
  }

  let dataSets = [dataSetsTmp.q1, dataSetsTmp.q2, dataSetsTmp.q3, dataSetsTmp.q4, dataSetsTmp.q5];
  return {labels: labels, datasets: dataSets};
}

/**
 * 名前から回答を取得
 */
function getAnswersByName(name) {
  // TODO: 作成
  let answers = [];
  answers[0] = {
      date : new Date(2018, 3, 20),
      q1 : 3,
      q2 : 2,
      q3 : 2,
      q4 : 4,
      q5 : 5,
    };
  answers[1] = {
      date : new Date(2018, 3, 21),
      q1 : 1,
      q2 : 5,
      q3 : 1,
      q4 : 4,
      q5 : 4,
    };
  answers[2] = {
      date : new Date(2018, 3, 23),
      q1 : 2,
      q2 : 5,
      q3 : 5,
      q4 : 4,
      q5 : 3,
    };
  return answers;
}

/**
 * 名前の一覧を取得
 */
function getAllNames() {
  // TODO: 作成
  return ["hoge", "hoge2", "hoge3"];
}

function getDatasetsTemplate() {
  return {
      q1 : {
          label: "私生活",
          borderColor: "rgba(249, 71, 66, 1)",
          backgroundColor: "rgba(249, 71, 66, 0.2)",
          spanGaps: true,
          data: [],
        },
      q2 : {
          label: "学校生活",
          borderColor: "rgba(52, 151, 254, 1)",
          backgroundColor: "rgba(52, 151, 254, 0.2)",
          spanGaps: true,
          data: [],
        },
      q3 : {
          label: "人間関係",
          borderColor: "rgba(245, 249, 66, 1)",
          backgroundColor: "rgba(245, 249, 66, 0.2)",
          spanGaps: true,
          data: [],
        },
      q4 : {
          label: "体調",
          borderColor: "rgba(66, 148, 67, 1)",
          backgroundColor: "rgba(66, 148, 67, 0.2)",
          spanGaps: true,
          data: [],
        },
      q5 : {
          label: "プライズ",
          borderColor: "rgba(249, 176, 66, 1)",
          backgroundColor: "rgba(249, 176, 66, 0.2)",
          spanGaps: true,
          data: [],
        },
    };
}
