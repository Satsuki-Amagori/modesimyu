from flask import Flask, request, jsonify
import random

app = Flask(__name__)

rows, cols = 6, 7
directions = [(0,1), (0,-1), (1,0), (-1,0), (1,1), (1,-1), (-1,1), (-1,-1)]
probabilities = [1/10, 1/10, 1/10, 1/10, 1/20, 1/20, 1/20, 1/20]

def simulate(start, moves):
    grid_count = [[0] * cols for _ in range(rows)]
    trials = 3

    for _ in range(trials):
        r, c = divmod(start, cols)
        prev_dir = None
        
        for _ in range(moves):
            choices = []
            probs = []

            for i, (dr, dc) in enumerate(directions):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    choices.append((nr, nc))
                    if prev_dir == (dr, dc):
                        probs.append(199/200)
                    else:
                        probs.append(1/1400)

            if choices:
                total_prob = sum(probs)
                probs = [p / total_prob for p in probs]
                r, c = random.choices(choices, weights=probs)[0]

            grid_count[r][c] += 1
            prev_dir = (r - prev_dir[0], c - prev_dir[1]) if prev_dir else None

    return grid_count

@app.route("/simulate", methods=["POST"])
def simulate_api():
    data = request.get_json()
    start = data["start"]
    moves = data["moves"]
    result = simulate(start, moves)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
