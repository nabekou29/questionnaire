const DATASETS_FORMAT = {
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

$(function() {
  createGraph("渡邉", new Date(2018, 3, 20), new Date(2018, 3, 23));
});

function createGraph(name, from, to) {
  var ctx = document.getElementById("lineChart").getContext('2d');
  var lineChart = new Chart(ctx, {
   type: 'line',
   data: createGraphData(name, from, to),
   options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 1,
                max: 5
              }
            }
          ]
        }
      }
 });

  $("#title").html(`${name}さんの${dateToString(from)} 〜 ${dateToString(to)}の心情`);
}

function createGraphData(name, from, to) {
  let answers = getAnswerByName(name);
  let labels = [];
  let dataSetsTmp = Object.assign({}, DATASETS_FORMAT);

  let dataIndex = 0;
  let targetDate = new Date(from.getTime());
  while (answers[dataIndex] < to) {
    dataIndex++;
  }
  for (; targetDate.getTime() <= to.getTime(); targetDate.setDate(targetDate.getDate() + 1)) {
    labels.push(`${targetDate.getMonth() + 1}/${targetDate.getDate()}`);

    let answer;
    if (answers[dataIndex].date.getTime() == targetDate.getTime()) {
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
  console.log({labels: labels, datasets: dataSets});
  return {labels: labels, datasets: dataSets};
}

function getAnswerByName(name) {
  // TODO 作成
  // date, name, q1, q2, q3, q4, q5, q6
  let data = [];
  data[0] = {
      date : new Date(2018, 3, 20),
      q1 : 3,
      q2 : 2,
      q3 : 2,
      q4 : 4,
      q5 : 5,
    };
  data[1] = {
      date : new Date(2018, 3, 21),
      q1 : 1,
      q2 : 5,
      q3 : 1,
      q4 : 4,
      q5 : 4,
    };
  data[2] = {
      date : new Date(2018, 3, 23),
      q1 : 2,
      q2 : 5,
      q3 : 5,
      q4 : 4,
      q5 : 3,
    };
  return data;
}

function dateToString(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
