var jms = null,
  timeHandle = null;
window.onload = function () {
  var radios = document.getElementsByName("level");
  for (var i = 0, j = radios.length; i < j; i++) {
    radios[i].onclick = function () {
      var value = this.value;
      init(value, value, (value * value) / 5 - value, (value * value) / 5);
      //document.getElementById("JMS_main").style.width =
       // value * 40 + 180 + 60 + "px";
    };
  }
  init(10, 10, 10, 10);
};

function init(rowCount, colCount, minLandMineCount, maxLandMineCount) {
  var doc = document,
    landMineCountElement = doc.getElementById("landMineCount"),
    timeShow = doc.getElementById("costTime"),
    beginButton = doc.getElementById("begin");
  if (jms != null) {
    clearInterval(timeHandle);
    timeShow.innerHTML = 0;
    landMineCountElement.innerHTML = 0;
  }
  jms = JMS("landmine", rowCount, colCount, minLandMineCount, maxLandMineCount);
  jms.endCallBack = function () {
  clearInterval(timeHandle);
};
jms.landMineCallBack = function (count) {
  landMineCountElement.innerHTML = count;
};

// "Start Game"�{�^���ɃC�x���g���o�C���h
beginButton.onclick = function () {
  jms.play(); // �Q�[����������

  // �n���̐���\��
  landMineCountElement.innerHTML = jms.landMineCount;

  // �Q�[�����J�n
  jms.begin();

  beginButton.onclick = function () {
  jms.play();
  landMineCountElement.innerHTML = jms.landMineCount;
  jms.begin();

  startGame(); // ��ʐ؂�ւ�

  timeHandle = setInterval(function () {
    timeShow.innerHTML = parseInt((new Date() - jms.beginTime) / 1000);
  }, 1000);
};


  // �o�ߎ��Ԃ��X�V
  timeHandle = setInterval(function () {
    timeShow.innerHTML = parseInt((new Date() - jms.beginTime) / 1000);
  }, 1000);
};
}