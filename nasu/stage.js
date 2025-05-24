//画面切り替え
function showScene(id) {
  document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

//ゲーム画面へ
function startGame() {
  showScene("JMS_main");
}

//ゲームオーバー画面へ
function gameOver() {
  //showScene("gameover");
  // 5秒後にタイトル画面に戻す
  setTimeout(function () {
    showScene("gameover");
  }, 5000); 
}
//ゲームクリア画面へ
function gameclear() {
  showScene("gameclear");
}

//もう一度ボタンでスタート画面に戻る
function restart() {
  showScene("state");
}

document.addEventListener("DOMContentLoaded", () => {
   // document.getElementById("begin").addEventListener("click", startGame);
});
