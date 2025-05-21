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

  // ページが読み込まれたら実行する
window.onload = function () {
  // JMSオブジェクトを作成（例：9x9 で地雷10?15個）
  var game = new JMS("landmine", 9, 9, 10, 15);
};

})();