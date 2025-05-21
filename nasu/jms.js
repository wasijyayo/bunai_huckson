(function () {
  // �}�C���X�C�[�p�[�I�u�W�F�N�g�����������A�f�[�^������������
  var JMS = function (
    id,
    rowCount,
    colCount,
    minLandMineCount,
    maxLandMineCount
  ) {
    if (!(this instanceof JMS))
      return new JMS(
        id,
        rowCount,
        colCount,
        minLandMineCount,
        maxLandMineCount
      );
    this.doc = document;
    this.table = this.doc.getElementById(id); // �O���b�h��`�悷��e�[�u��
    this.cells = this.table.getElementsByTagName("td"); // �Z��
    this.rowCount = rowCount || 10; // �O���b�h�̍s��
    this.colCount = colCount || 10; // �O���b�h�̗�
    this.landMineCount = 0; // �n���̐�
    this.markLandMineCount = 0; // �}�[�N���ꂽ�n���̐�
    this.minLandMineCount = minLandMineCount || 10; // �ŏ��n����
    this.maxLandMineCount = maxLandMineCount || 20; // �ő�n����
    this.arrs = []; // �Z���ɑΉ�����z��
    this.beginTime = null; // �Q�[���̊J�n����
    this.endTime = null; // �Q�[���̏I������
    this.currentSetpCount = 0; // ���s���ꂽ�X�e�b�v��
    this.endCallBack = null; // �Q�[���I�����̃R�[���o�b�N�֐�
    this.landMineCallBack = null; // �n�����}�[�N���ꂽ�Ƃ��̎c��̒n�������X�V����R�[���o�b�N�֐�
    this.doc.oncontextmenu = function () {
      // �E�N���b�N���j���[�𖳌��ɂ���
      return false;
    };
    this.drawMap();
  };

  // JMS �̃v���g�^�C�v�ɃZ�����쐬����
  JMS.prototype = {
    // �O���b�h��`�悷��
    drawMap: function () {
      var tds = [];
      // �u���E�U�݊����̂���
      if (
        window.ActiveXObject &&
        parseInt(navigator.userAgent.match(/msie ([\d.]+)/i)[1]) < 8
      ) {
        // �V���� CSS �X�^�C���t�@�C�����쐬����
        var css = "#JMS_main table td{background-color:#888;}",
          // �w�b�h�^�O���擾����
          head = this.doc.getElementsByTagName("head")[0],
          // �X�^�C���^�O���쐬����
          style = this.doc.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
          // CSS �X�^�C�����X�^�C���^�O�Ɋ��蓖�Ă�
          style.styleSheet.cssText = css;
        } else {
          // �X�^�C���^�O���Ƀm�[�h���쐬����
          style.appendChild(this.doc.createTextNode(css));
        }
        // �X�^�C���^�O���w�b�h�^�O�̎q�^�O�Ƃ��Ēǉ�����
        head.appendChild(style);
      }
      // ���[�v���ăe�[�u�����쐬����
      for (var i = 0; i < this.rowCount; i++) {
        tds.push("<tr>");
        for (var j = 0; j < this.colCount; j++) {
          tds.push("<td id='m_" + i + "_" + j + "'></td>");
        }
        tds.push("</tr>");
      }
      this.setTableInnerHTML(this.table, tds.join(""));
    },
    // �e�[�u���� HTML ��ǉ�����
    setTableInnerHTML: function (table, html) {
      if (navigator && navigator.userAgent.match(/msie/i)) {
        // �e�[�u���̏��L�҃h�L�������g���� div ���쐬����
        var temp = table.ownerDocument.createElement("div");
        // �e�[�u���� tbody �̓��e���쐬����
        temp.innerHTML = "<table><tbody>" + html + "</tbody></table>";
        if (table.tBodies.length == 0) {
          var tbody = document.createElement("tbody");
          table.appendChild(tbody);
        }
        table.replaceChild(temp.firstChild.firstChild, table.tBodies[0]);
      } else {
        table.innerHTML = html;
      }
    }
  };

  window.JMS = JMS;

  // �y�[�W���ǂݍ��܂ꂽ����s����
window.onload = function () {
  // JMS�I�u�W�F�N�g���쐬�i��F9x9 �Œn��10?15�j
  var game = new JMS("landmine", 9, 9, 10, 15);
};

})();