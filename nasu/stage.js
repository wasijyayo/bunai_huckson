//��ʐ؂�ւ�
function showScene(id) {
  document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

//�Q�[����ʂ�
function startGame() {
  showScene("JMS_main");
}

//�Q�[���I�[�o�[��ʂ�
function gameOver() {
  //showScene("gameover");
  // 5�b��Ƀ^�C�g����ʂɖ߂�
  setTimeout(function () {
    showScene("gameover");
  }, 5000); 
}
//�Q�[���N���A��ʂ�
function gameclear() {
  showScene("gameclear");
}

//������x�{�^���ŃX�^�[�g��ʂɖ߂�
function restart() {
  showScene("state");
}

document.addEventListener("DOMContentLoaded", () => {
   // document.getElementById("begin").addEventListener("click", startGame);
});
