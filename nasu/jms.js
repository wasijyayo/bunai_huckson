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
        // �Q�[���J�n
    begin: function() {
        this.currentSetpCount = 0; // �X�e�b�v�����[���Ƀ��Z�b�g
        this.markLandMineCount = 0;
        this.beginTime = new Date(); // �Q�[���J�n����
        this.hideAll();
        this.bindCells();
    },
    // �Q�[���I��
    end: function() {
        this.endTime = new Date(); // �Q�[���I������
        if (this.endCallBack) { // �R�[���o�b�N�֐������݂���ꍇ�͌Ăяo��
            this.endCallBack();
        }
    },
    // �Q�[������
    success: function() {
        this.end();
        this.showAll();
        this.disableAll();
        gameclear();
    },
    // �Q�[�����s
    failed: function() {
        this.end();
        this.showAll();
        this.disableAll();
        gameOver();
    },
    // �G���g���[�|�C���g
    play: function() {
        this.init();
        this.landMine();
        this.calculateNoLandMineCount();
    },
    // �v�f���擾����
    $: function (id) {
        return this.doc.getElementById(id);
    },
    // �e�Z���ɃN���b�N�C�x���g�i���ƉE�j���o�C���h����
    bindCells: function () {
        var self = this;
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                (function (row, col) {
                    self.$("m_" + i + "_" + j).onmousedown = function (e) {
                        e = e || window.event;
                        var mouseNum = e.button;
                        var className = this.className;
                        if (mouseNum == 2) {
                            if (className == "flag") {
                                this.className = "";
                                self.markLandMineCount--;
                            } else {
                                this.className = "flag";
                                self.markLandMineCount++;
                            }
                            if (self.landMineCallBack) {
                                self.landMineCallBack(self.landMineCount - self.markLandMineCount);
                            }
                        } else if (className!= "flag") {
                            self.openBlock.call(self, this, row, col);
                        }
                    };
                })(i,j);
            }
        }
    },
    // �n���̂Ȃ��̈��W�J����
    showNoLandMine: function (x, y) {
        for (var i = x - 1; i < x + 2; i++)
            for (var j = y - 1; j < y + 2; j++) {
                if (!(i == x && j == y)) {
                    var ele = this.$("m_" + i + "_" + j);
                    if (ele && ele.className == "") {
                        this.openBlock.call(this, ele, i, j);
                    }
                }
            }
    },
    // �\������
    openBlock: function (obj, x, y) {
        if (this.arrs[x][y]!= 9) {
            this.currentSetpCount++;
            if (this.arrs[x][y]!= 0) {
                obj.innerHTML = this.arrs[x][y];
            }
            obj.className = "clicked-cell";
            obj.classList.add("safe");
            if (this.currentSetpCount + this.landMineCount == this.rowCount * this.colCount) {
                this.success();
            }
            obj.onmousedown = null;
            if (this.arrs[x][y] == 0) {
                this.showNoLandMine.call(this, x, y);
            }
        } else {
            this.failed();
        }
    },
    // �n����\������
    showLandMine: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                if (this.arrs[i][j] == 9) {
                    this.$("m_" + i + "_" + j).className = "landMine";
                }
            }
        }
    },
    // ���ׂẴZ���̏���\������
    showAll: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                if (this.arrs[i][j] == 9) {
                    this.$("m_" + i + "_" + j).className = "landMine";
                } else {
                    var ele=this.$("m_" + i + "_" + j);
                    if (this.arrs[i][j]!= 0)
                        ele.innerHTML = this.arrs[i][j];
                    ele.className = "normal";
                }
            }
        }
    },
    // �\������Ă���Z���̏����N���A����
    hideAll: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                var tdCell = this.$("m_" + i + "_" + j);
                tdCell.className = "";
                tdCell.innerHTML = "";
            }
        }
    },
    // �Z���Ƀo�C���h����Ă���C�x���g���폜����
    disableAll: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                var tdCell = this.$("m_" + i + "_" + j);
                tdCell.onmousedown = null;
            }
        }
    },
        // �������F�z��̏����l�� 0 �ɐݒ肵�A�n���̐������肷��
    init: function () {
        for (var i = 0; i < this.rowCount; i++) {
            this.arrs[i] = [];
            for (var j = 0; j < this.colCount; j++) {
                this.arrs[i][j] = 0;
            }
        }
        this.landMineCount = this.selectFrom(this.minLandMineCount, this.maxLandMineCount);
        this.markLandMineCount = 0;
        this.beginTime = null;
        this.endTime = null;
        this.currentSetpCount = 0;
    },
    // �n�����܂܂��z��v�f�̒l��9�ɐݒ肷��
    landMine: function () {
        var allCount = this.rowCount * this.colCount - 1,
            tempArr = {};
        for (var i = 0; i < this.landMineCount; i++) {
            var randomNum = this.selectFrom(0, allCount),
                rowCol = this.getRowCol(randomNum);
            if (randomNum in tempArr) {
                i--;
                continue;
            }
            this.arrs[rowCol.row][rowCol.col] = 9;
            tempArr[randomNum] = randomNum;
        }
    },
    // ���̃Z���̐������v�Z����
    calculateNoLandMineCount: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                if (this.arrs[i][j] == 9)
                    continue;
                if (i > 0 && j > 0) {
                    if (this.arrs[i - 1][j - 1] == 9)
                        this.arrs[i][j]++;
                }
                if (i > 0) {
                    if (this.arrs[i - 1][j] == 9)
                        this.arrs[i][j]++;
                }
                if (i > 0 && j < this.colCount - 1) {
                    if (this.arrs[i - 1][j + 1] == 9)
                        this.arrs[i][j]++;
                }
                if (j > 0) {
                    if (this.arrs[i][j - 1] == 9)
                        this.arrs[i][j]++;
                }
                if (j < this.colCount - 1) {
                    if (this.arrs[i][j + 1] == 9)
                        this.arrs[i][j]++;
                }
                if (i < this.rowCount - 1 && j > 0) {
                    if (this.arrs[i + 1][j - 1] == 9)
                        this.arrs[i][j]++;
                }
                if (i < this.rowCount - 1) {
                    if (this.arrs[i + 1][j] == 9)
                        this.arrs[i][j]++;
                }
                if (i < this.rowCount - 1 && j < this.colCount - 1) {
                    if (this.arrs[i + 1][j + 1] == 9)
                        this.arrs[i][j]++;
                }
            }
        }
    },
    // �����_���Ȑ����擾����
    selectFrom: function (iFirstValue, iLastValue) {
        var iChoices = iLastValue - iFirstValue + 1;
        return Math.floor(Math.random() * iChoices + iFirstValue);
    },
    // �l�Ɋ�Â��čs�Ɨ�̔ԍ���������
    getRowCol: function (val) {
        return {
            row: parseInt(val / this.colCount),
            col: val % this.colCount
        };
    },
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
    })();