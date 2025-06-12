from flask import Flask, render_template, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()
comments = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    comment = data['comment']
    score = analyzer.polarity_scores(comment)

    # Determine label from compound score
    compound = score['compound']
    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    result = {
        "sentiment": sentiment,
        "compound": round(compound, 2),
        "text": comment
    }
    comments.append(result)
    return jsonify(result)

@app.route('/data')
def get_data():
    return jsonify(comments)

if __name__ == '__main__':
    app.run(debug=True)
