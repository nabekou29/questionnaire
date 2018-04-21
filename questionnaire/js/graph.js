const DATASETS_FORMAT = {
    q1 : {
        label: "私生活",
        fillColor: "rgba(209, 218, 36, 0.2)",
        strokeColor: "rgba(209, 218, 36, 1)",
        pointColor: "rgba(209, 218, 36, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(209, 218, 36, 1)",
        data: [],
      },
    q2 : {
        label: "学校生活",
        fillColor: "rgba(65, 147, 255, 0.2)",
        strokeColor: "rgba(65, 147, 255, 1)",
        pointColor: "rgba(65, 147, 255, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(65, 147, 255, 1)",
        data: [],
      },
    q3 : {
        label: "人間関係",
        fillColor: "rgba(36, 218, 54, 0.2)",
        strokeColor: "rgba(36, 218, 54, 1)",
        pointColor: "rgba(36, 218, 54, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(36, 218, 54, 1)",
        data: [],
      },
    q4 : {
        label: "体調",
        fillColor: "rgba(218, 97, 65, 0.2)",
        strokeColor: "rgba(218, 97, 65, 1)",
        pointColor: "rgba(218, 97, 65, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(218, 97, 65, 1)",
        data: [],
      },
    q5 : {
        label: "プライズ",
        fillColor: "rgba(214, 142, 3, 0.2)",
        strokeColor: "rgba(214, 142, 3, 1)",
        pointColor: "rgba(214, 142, 3, 1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(214, 142, 3, 1)",
        data: [],
      },
  };

$(function() {
  createGraph("渡邉", new Date(2018, 3, 20, 22, 30), new Date(2018, 3, 22, 22, 30));
});

function createGraph(name, from, to) {
  let data = createGraphData(name, from, to);
  let ctx = document.getElementById("lineChart").getContext("2d");
  let options = {};
  let lineChart = new Chart(ctx).Line(data, options);
}

function createGraphData(name, from, to) {
  let answers = getAnswerByName(name);
  let labels = [];
  let dataSetsTmp = Object.assign({}, DATASETS_FORMAT);

  let targetDate = new Date(from.getTime());
  for (let i = 0; targetDate.getTime() <= to.getTime(); targetDate.setDate(targetDate.getDate() + 1), i++) {
    labels.push(`${targetDate.getMonth() + 1}/${targetDate.getDate()}`);
    dataSetsTmp.q1.data.push(answers[i].q1);
    dataSetsTmp.q2.data.push(answers[i].q2);
    dataSetsTmp.q3.data.push(answers[i].q3);
    dataSetsTmp.q4.data.push(answers[i].q4);
    dataSetsTmp.q5.data.push(answers[i].q5);
  }

  let dataSets = [dataSetsTmp.q1, dataSetsTmp.q2, dataSetsTmp.q3, dataSetsTmp.q4, dataSetsTmp.q5];
  console.log({labels: labels, datasets: dataSets});
  return {labels: labels, datasets: dataSets};
}

function getAnswerByName(name) {
  // TODO 作成
  // date, name, q1, q2, q3, q4, q5, q6
  let data = [];
  data[0] = {
      date : new Date(2018, 3, 20, 22, 30),
      q1 : 3,
      q2 : 2,
      q3 : 2,
      q4 : 4,
      q5 : 5,
    };
  data[1] = {
      date : new Date(2018, 3, 21, 22, 50),
      q1 : 1,
      q2 : 5,
      q3 : 1,
      q4 : 4,
      q5 : 4,
    };
  data[2] = {
      date : new Date(2018, 3, 22, 22, 50),
      q1 : 2,
      q2 : 5,
      q3 : 1,
      q4 : 4,
      q5 : 3,
    };
  return data;
}
