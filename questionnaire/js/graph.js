const images = {
  "5": "img/mark_tenki_hare.png",
  "4": "img/mark_tenki_hare_kumori.png",
  "3": "img/mark_tenki_kumori.png",
  "2": "img/mark_tenki_kumori_ame.png",
  "1": "img/mark_tenki_umbrella.png",
};

$(function() {
  // chart.jsの設定
  Chart.defaults.line.spanGaps = true;
  let allAnswers = getCSV();

  // 名前一覧のセレクトボックス生成
  let namesSelect = document.getElementById("names");
  getAllNames(allAnswers).forEach(function(name) {
    let option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    namesSelect.appendChild(option);
  });

  const format = "YYYY-MM-DD"
  // 日付のデフォルト値を設定
  let setDate = moment()
  $("#to").val(setDate.format(format));
  $("#from").val(setDate.subtract(7, "days").format(format));

  // グラフ生成のイベント登録
  $("#names, #to, #from").on('change', function() {
    let name = $("#names").val();
    let from = moment($("#from").val(), format);
    let to = moment($("#to").val(), format);
    if (name) {
      drawGraph(name, from, to, allAnswers);
      displayComment(name, from, to, allAnswers);
    }
  });

});

//CSVファイルを読み込む関数getCSV()の定義
function getCSV(){
  let req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", "csv/nippo.csv", false); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行

  let arr = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
  let answers = [];
  arr.forEach(function(e, i) {
    answers.push({
        date: new Date(e[0]),
        id: e[1],
        name: e[2],
        q1: e[3],
        q2: e[4],
        q3: e[5],
        q4: e[6],
        q5: e[7],
        comment: e[8],
      });
  });

  return answers;
}

function convertCSVtoArray(str){
  let result = []; // 最終的な二次元配列を入れるための配列
  let tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
  let cnt = 0;
  for(var i=1;　i　<　tmp.length - 1;　i++){
    result[i - cnt] = tmp[i].split(',');
    if (result[i - cnt].length === 1) {
      result[i - cnt - 1][8] += "\n" + result[i - cnt][0];
      result[i - cnt - 1][8] = result[i - cnt - 1][8].replace(/\"/g, "")
      cnt += 1;
    }
  }
  return result;
}

/**
 * グラフの描画
 */
function drawGraph(name, from, to, allAnswers) {
  $("#lineChart").remove();
  $("<canvas>", {
    id: 'lineChart',
  }).appendTo("div.lineChart");

  let ctx = $("#lineChart")[0].getContext('2d');
  ctx.clearRect(0, 0, ctx.width, ctx.height);

  let data = [];
  let comments = [];
  [data, comments] = createGraphData(name, from, to, allAnswers);

  let lineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      scales: {
        yAxes: [{ticks: {min: 1, max: 5}}]
      },
      tooltips: {
            mode: 'index',
            axis: 'y',
            position: 'nearest',
            callbacks: {
              footer: (tooltipItems, data) => ['<ひとこと>'].concat(comments[tooltipItems[0].index].comment.split("\n")),
            },
            footerMarginTop: 14,
      },
    }
  });

  const format = "M/D"
  $("#graph-title").html(`${name}さんの${from.format(format)} 〜 ${to.format(format)}の様子`);
}

/**
 * グラフ用のデータ作成
 */
function createGraphData(name, from, to, allAnswers) {
  let answers = trimAnswer(name, from, to, allAnswers);
  let labels = [];
  let comments = [];
  let dataSetsTmp = getDatasetsTemplate();

  const format = "M/D";
  answers.forEach(function(answer) {
    console.log(answer.date);
    labels.push(answer.date.format(format));
    dataSetsTmp.q1.data.push(answer.q1);
    dataSetsTmp.q2.data.push(answer.q2);
    dataSetsTmp.q3.data.push(answer.q3);
    dataSetsTmp.q4.data.push(answer.q4);
    dataSetsTmp.q5.data.push(answer.q5);
    comments.push({comment: answer.comment, date: moment(answer.date.toDate())});
  });

  let dataSets = [dataSetsTmp.q1, dataSetsTmp.q2, dataSetsTmp.q3, dataSetsTmp.q4, dataSetsTmp.q5];
  return [{labels: labels, datasets: dataSets}, comments];
}

function displayComment(name, from, to, allAnswers) {
  let answers = trimAnswer(name, from, to, allAnswers);
  $('#comments').html("");
  $('#comments').append(`<tr><th>日付</th><th>私</th><th>学</th><th>人</th><th>体</th><th>プ</th><th>ひとこと</th></tr>`)
  answers.filter(a => a.comment).forEach(function(e, i) {
    $('#comments').append(
        `<tr><td>${e.date.format("YYYY/MM/DD")}</td>`
        + "<td>"
        + [e.q1, e.q2, e.q3, e.q4, e.q5]
            .map(q => `<img src=./${images[q]} width="20" height="20">`)
            .join("</td><td>")
        + "</td>"
        // + `<td>${e.q1}</td><td>${e.q2}</td><td>${e.q3}</td><td>${e.q4}</td><td>${e.q5}</td>`
        + `<td>${e.comment}</td></tr>`)
  });
}

/**
 * 名前と指定された日付の範囲から回答を取得します
 */
function trimAnswer(name, from, to, allAnswers) {
  let answers = getAnswersByName(name, allAnswers);
  let tmpAnswers = [];
  let dataIndex = 0;
  let targetDate = moment(from.toDate());
  while (moment(answers[dataIndex].date).diff(from) < 0) {
    dataIndex += 1;
    if (dataIndex >= answers.length) {
      break;
    }
  }
  for (; targetDate.diff(to) <= 0; targetDate = targetDate.add(1, "days")) {
    let answer;
    if (dataIndex < answers.length && targetDate.diff(moment(answers[dataIndex].date)) == 0) {
      answer = Object.assign(answers[dataIndex]);
      // Date -> moment
      answer.date = moment(answer.date);
      dataIndex++;
    } else {
      answer = {...emptyAnswer(), date: moment(targetDate.toDate()),};
    }
    tmpAnswers.push(answer);
  }
  return tmpAnswers;
}

/**
 * 名前から回答を取得
 */
function getAnswersByName(name, allAnswers) {
  return allAnswers.filter(o => o.name === name).sort(o => o.date).reverse();
}

/**
 * 名前の一覧を取得
 */
function getAllNames(allAnswers) {
  return allAnswers.map(o => o.name).filter(name => name).filter((x, i, self) => self.indexOf(x) === i).sort();
}

/**
 * 空の回答を作成
 */
function emptyAnswer() {
  return {date: null,
      id: "",
      name: "",
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      comment: "",
    };
}

function getDatasetsTemplate() {
  const lineTension = 0.2;
  return {
      q1 : {
          label: "私生活",
          borderColor: "rgba(249, 71, 66, 1)",
          backgroundColor: "rgba(249, 71, 66, 0.2)",
          data: [],
          lineTension: lineTension,
        },
      q2 : {
          label: "学校生活",
          borderColor: "rgba(52, 151, 254, 1)",
          backgroundColor: "rgba(52, 151, 254, 0.2)",
          data: [],
          lineTension: lineTension,
        },
      q3 : {
          label: "人間関係",
          borderColor: "rgba(245, 249, 66, 1)",
          backgroundColor: "rgba(245, 249, 66, 0.2)",
          data: [],
          lineTension: lineTension,
        },
      q4 : {
          label: "体調",
          borderColor: "rgba(66, 148, 67, 1)",
          backgroundColor: "rgba(66, 148, 67, 0.2)",
          data: [],
          lineTension: lineTension,
        },
      q5 : {
          label: "プライズ",
          borderColor: "rgba(249, 176, 66, 1)",
          backgroundColor: "rgba(249, 176, 66, 0.2)",
          data: [],
          lineTension: lineTension,
        },
    };
}
