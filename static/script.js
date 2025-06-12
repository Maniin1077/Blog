let sentimentChart;
let sentimentData = { Positive: 0, Negative: 0, Neutral: 0 };

function submitComment() {
  const comment = document.getElementById("comment").value;

  fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: comment })
  })
  .then(res => res.json())
  .then(data => {
    const sentiment = data.sentiment;
    const score = data.compound;
    let emoji = "";

    switch (sentiment.toLowerCase()) {
      case "positive": emoji = "😊"; break;
      case "negative": emoji = "😞"; break;
      case "neutral": emoji = "😐"; break;
    }

    document.getElementById("result").innerHTML =
      `Sentiment: <span style="color:#2575fc">${sentiment.toUpperCase()}</span> ${emoji}`;

    sentimentData[sentiment]++;
    updateChart();
  });
}


function updateChart() {
  const ctx = document.getElementById('sentimentChart').getContext('2d');
  if (sentimentChart) sentimentChart.destroy();

  sentimentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [{
        label: 'Sentiment Count',
        data: [sentimentData.Positive, sentimentData.Negative, sentimentData.Neutral],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
