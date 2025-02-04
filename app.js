function simulate(start, moves) {
    let gridCount = Array.from({ length: rows }, () => Array(cols).fill(0));
    let trials = 1000;  // 試行回数

    // 方向ごとの確率をあらかじめ計算
    const baseProbs = directions.map(dir => (dir.dr === 0 || dir.dc === 0) ? 1 / 10 : 1 / 20);

    for (let trial = 0; trial < trials; trial++) {
        let r = Math.floor(start / cols);
        let c = start % cols;
        let prevDir = null;

        for (let move = 0; move < moves; move++) {
            let choices = [];
            let probs = [];

            for (let i = 0; i < directions.length; i++) {
                let { dr, dc } = directions[i];
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    choices.push({ r: nr, c: nc });
                    probs.push((prevDir && prevDir.dr === dr && prevDir.dc === dc) ? 199 / 200 : 1 / 1400);
                }
            }

            if (choices.length > 0) {
                // 確率を正規化して高速化
                let totalProb = probs.reduce((sum, p) => sum + p, 0);
                let rand = Math.random() * totalProb;
                let cumulative = 0;
                let selectedIdx = 0;
                for (let i = 0; i < probs.length; i++) {
                    cumulative += probs[i];
                    if (rand <= cumulative) {
                        selectedIdx = i;
                        break;
                    }
                }

                let selectedMove = choices[selectedIdx];
                r = selectedMove.r;
                c = selectedMove.c;
                prevDir = { dr: selectedMove.r - r, dc: selectedMove.c - c };
            }

            gridCount[r][c] += 1;
        }
    }

    return gridCount;
}

