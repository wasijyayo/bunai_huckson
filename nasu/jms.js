(function () {
  // マインスイーパーオブジェクトを初期化し、データを初期化する
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
    this.table = this.doc.getElementById(id); // グリッドを描画するテーブル
    this.cells = this.table.getElementsByTagName("td"); // セル
    this.rowCount = rowCount || 10; // グリッドの行数
    this.colCount = colCount || 10; // グリッドの列数
    this.landMineCount = 0; // 地雷の数
    this.markLandMineCount = 0; // マークされた地雷の数
    this.minLandMineCount = minLandMineCount || 10; // 最小地雷数
    this.maxLandMineCount = maxLandMineCount || 20; // 最大地雷数
    this.arrs = []; // セルに対応する配列
    this.beginTime = null; // ゲームの開始時間
    this.endTime = null; // ゲームの終了時間
    this.currentSetpCount = 0; // 実行されたステップ数
    this.endCallBack = null; // ゲーム終了時のコールバック関数
    this.landMineCallBack = null; // 地雷がマークされたときの残りの地雷数を更新するコールバック関数
    this.doc.oncontextmenu = function () {
      // 右クリックメニューを無効にする
    return false;
    };
    this.drawMap();
  };

  // JMS のプロトタイプにセルを作成する
  JMS.prototype = {
        // ゲーム開始
    begin: function() {
        this.currentSetpCount = 0; // ステップ数をゼロにリセット
        this.markLandMineCount = 0;
        this.beginTime = new Date(); // ゲーム開始時間
        this.hideAll();
        this.bindCells();
    },
    // ゲーム終了
    end: function() {
        this.endTime = new Date(); // ゲーム終了時間
        if (this.endCallBack) { // コールバック関数が存在する場合は呼び出す
            this.endCallBack();
        }
    },
    // ゲーム成功
    success: function() {
        this.end();
        this.showAll();
        this.disableAll();
        gameclear();
    },
    // ゲーム失敗
    failed: function() {
        this.end();
        this.showAll();
        this.disableAll();
        gameOver();
    },
    // エントリーポイント
    play: function() {
        this.init();
        this.landMine();
        this.calculateNoLandMineCount();
    },
    // 要素を取得する
    $: function (id) {
        return this.doc.getElementById(id);
    },
    // 各セルにクリックイベント（左と右）をバインドする
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
    // 地雷のない領域を展開する
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
    // 表示する
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
    // 地雷を表示する
    showLandMine: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                if (this.arrs[i][j] == 9) {
                    this.$("m_" + i + "_" + j).className = "landMine";
                }
            }
        }
    },
    // すべてのセルの情報を表示する
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
    // 表示されているセルの情報をクリアする
    hideAll: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                var tdCell = this.$("m_" + i + "_" + j);
                tdCell.className = "";
                tdCell.innerHTML = "";
            }
        }
    },
    // セルにバインドされているイベントを削除する
    disableAll: function () {
        for (var i = 0; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                var tdCell = this.$("m_" + i + "_" + j);
                tdCell.onmousedown = null;
            }
        }
    },
        // 初期化：配列の初期値を 0 に設定し、地雷の数を決定する
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
    // 地雷が含まれる配列要素の値を9に設定する
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
    // 他のセルの数字を計算する
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
    // ランダムな数を取得する
    selectFrom: function (iFirstValue, iLastValue) {
        var iChoices = iLastValue - iFirstValue + 1;
        return Math.floor(Math.random() * iChoices + iFirstValue);
    },
    // 値に基づいて行と列の番号を見つける
    getRowCol: function (val) {
        return {
            row: parseInt(val / this.colCount),
            col: val % this.colCount
        };
    },
        // グリッドを描画する
        drawMap: function () {
        var tds = [];
        // ブラウザ互換性のため
        if (
            window.ActiveXObject &&
            parseInt(navigator.userAgent.match(/msie ([\d.]+)/i)[1]) < 8
        ) {
            // 新しい CSS スタイルファイルを作成する
            var css = "#JMS_main table td{background-color:#888;}",
            // ヘッドタグを取得する
            head = this.doc.getElementsByTagName("head")[0],
            // スタイルタグを作成する
            style = this.doc.createElement("style");
            style.type = "text/css";
            if (style.styleSheet) {
            // CSS スタイルをスタイルタグに割り当てる
            style.styleSheet.cssText = css;
            } else {
            // スタイルタグ内にノードを作成する
            style.appendChild(this.doc.createTextNode(css));
            }
            // スタイルタグをヘッドタグの子タグとして追加する
            head.appendChild(style);
        }
        // ループしてテーブルを作成する
        for (var i = 0; i < this.rowCount; i++) {
            tds.push("<tr>");
            for (var j = 0; j < this.colCount; j++) {
            tds.push("<td id='m_" + i + "_" + j + "'></td>");
            }
            tds.push("</tr>");
        }
        this.setTableInnerHTML(this.table, tds.join(""));
        },
        // テーブルに HTML を追加する
        setTableInnerHTML: function (table, html) {
        if (navigator && navigator.userAgent.match(/msie/i)) {
            // テーブルの所有者ドキュメント内に div を作成する
            var temp = table.ownerDocument.createElement("div");
            // テーブルの tbody の内容を作成する
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