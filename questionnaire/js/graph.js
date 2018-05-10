$(function() {
  // chart.jsの設定
  Chart.defaults.line.spanGaps = true;

  // 名前一覧のセレクトボックス生成
  let namesSelect = document.getElementById("names");
  getAllNames().forEach(function(name) {
    let option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    namesSelect.appendChild(option);
  });

  // 日付のデフォルト値を設定
  let setDate = moment()
  const format = "YYYY-MM-DD"
  $("#to").val(setDate.format(format));
  $("#from").val(moment().subtract(7, "days").format(format));

  // グラフ生成のイベント登録
  $("#names, #to, #from").on('change', function() {
    let name = $("#names").val();
    let from = moment($("#from").val(), format);
    let to = moment($("#to").val(), format);
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
      },
      tooltips: {
            mode: 'index',
            axis: 'y',
            position: 'nearest',
      },
    }
  });

  const format = "M/DD"
  $("#graph-title").html(`${name}さんの${from.format(format)} 〜 ${to.format(format)}の心情変化`);
}

/**
 * グラフ用のデータ作成
 */
function createGraphData(name, from, to) {
  let answers = getAnswersByName(name);
  let labels = [];
  let dataSetsTmp = getDatasetsTemplate();

  let dataIndex = 0;
  let targetDate = moment(from.toDate());
  while (answers[dataIndex] < to) {
    dataIndex++;
  }

  const format = "M/DD"
  for (; targetDate.diff(to) <= 0; targetDate = targetDate.add(1, "days")) {
    labels.push(targetDate.format(format));
    let answer;
    if (dataIndex < answers.length && targetDate.diff(moment(answers[dataIndex].date)) == 0) {
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
      date: new Date(2018, 3, 20),
      q1: 3,
      q2: 2,
      q3: 2,
      q4: 4,
      q5: 5,
    };
  answers[1] = {
      date: new Date(2018, 3, 21),
      q1: 1,
      q2: 5,
      q3: 1,
      q4: 4,
      q5: 4,
    };
  answers[2] = {
      date: new Date(2018, 3, 23),
      q1: 2,
      q2: 5,
      q3: 5,
      q4: 4,
      q5: 3,
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
          data: [],
        },
      q2 : {
          label: "学校生活",
          borderColor: "rgba(52, 151, 254, 1)",
          backgroundColor: "rgba(52, 151, 254, 0.2)",
          data: [],
        },
      q3 : {
          label: "人間関係",
          borderColor: "rgba(245, 249, 66, 1)",
          backgroundColor: "rgba(245, 249, 66, 0.2)",
          data: [],
        },
      q4 : {
          label: "体調",
          borderColor: "rgba(66, 148, 67, 1)",
          backgroundColor: "rgba(66, 148, 67, 0.2)",
          data: [],
        },
      q5 : {
          label: "プライズ",
          borderColor: "rgba(249, 176, 66, 1)",
          backgroundColor: "rgba(249, 176, 66, 0.2)",
          data: [],
        },
    };
}
