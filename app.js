const rows = 6, cols = 7;
const directions = [
    { dr: 0, dc: 1 },  // 右
    { dr: 0, dc: -1 }, // 左
    { dr: 1, dc: 0 },  // 下
    { dr: -1, dc: 0 }, // 上
    { dr: 1, dc: 1 },  // 右下（斜め）
    { dr: 1, dc: -1 }, // 左下（斜め）
    { dr: -1, dc: 1 }, // 右上（斜め）
    { dr: -1, dc: -1 } // 左上（斜め）
];

function simulate(start, moves) {
    let gridCount = Array.from({ length: rows }, () => Array(cols).fill(0));
    let trials = 1000;

    for (let trial = 0; trial < trials; trial++) {
        let r = Math.floor(start / cols);
        let c = start % cols;
        let prevDir = null;

        for (let move = 0; move < moves; move++) {
            let choices = [];
            let probs = [];

            // 移動可能な方向と確率を決定
            for (let { dr, dc } of directions) {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    choices.push({ r: nr, c: nc });

                    if (prevDir && prevDir.dr === dr && prevDir.dc === dc) {
                        probs.push(199 / 200);
                    } else {
                        probs.push(1 / 1400);
                    }
                }
            }

            if (choices.length > 0) {
                // 確率を正規化
                let totalProb = probs.reduce((sum, p) => sum + p, 0);
                let normalizedProbs = probs.map(p => p / totalProb);

                // 確率に基づいて移動先を選択
                let rand = Math.random();
                let cumulative = 0;
                let selectedIdx = 0;
                for (let i = 0; i < normalizedProbs.length; i++) {
                    cumulative += normalizedProbs[i];
                    if (rand <= cumulative) {
                        selectedIdx = i;
                        break;
                    }
                }

                let selectedMove = choices[selectedIdx];
                r = selectedMove.r;
                c = selectedMove.c;
                prevDir = { dr: r - prevDir?.r || 0, dc: c - prevDir?.c || 0 };
            }

            gridCount[r][c] += 1;
        }
    }
    
    return gridCount;
}

