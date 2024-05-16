<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relations</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="link.png">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="left"></div>
            <div class="middle">
                <h1>Relations</h1>
            </div>
            <div class="right">
            <h1 id="date"></h1>
        </div>
        </div>
        <div class="game" id="game">
            <div class="top" id="top">
                <div class="alert">
                
                </div>
                <div class="hint">
                </div>
                <div class="letter-display"></div>
                <div class="answers"></div>
            </div>
            <canvas id="lineCanvas"></canvas>
            <div class="grid">
            </div>
            <div class="bottom">
                <div class="mistakes"></div>
                <div class="buttons">
                    <button id="submit" onclick="submit()">SUBMIT</button>
                    <button id="reset" onclick="reset()">RESET</button>
                </div>
            </div>
        </div>
    </div>
<script src="script.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>
</body>
</html>
