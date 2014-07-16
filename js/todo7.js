// Initialize your app
var myApp = new Framework7({
  modalTitle: 'ToDo7'
});

// Export selectors engine
var $$ = Framework7.$;

// Add views
var mainView = myApp.addView('.view-main', {
  // Because we use fixed-through navbar we can enable dynamic navbar
  dynamicNavbar: true
});

// ローカルストレージにデータがあればその配列を、なければ空の配列を返す。
var todoData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];

$$('.delete').on('click', function () {
  localStorage.clear();
  init();
});

// フィルターを押したときの処理
$$('.filter').on('click', function () {
  var color = $$(this).attr("data-type");
  buildTodoListHtml(color);
  if (color === "any") {
    $$(".top-text").text("すべてのカード");
  } else {
    $$(".top-text").text(localStorage["tag" + color] || "タグ名なし");
  }
});

// ポップアップ
$$('.popup').on('open', function () {
  $$('body').addClass('with-popup');
  var color = $$('.popup .color.selected').attr('data-color');
  $$(".tag").val(localStorage["tag" + color] || "");
  $$("input.tag").removeClass("pink");
  $$("input.tag").removeClass("orange");
  $$("input.tag").removeClass("yellow");
  $$("input.tag").removeClass("green");
  $$("input.tag").removeClass("blue");
  $$("input.tag").addClass(color);
});


// ポップアップ閉じるときに、タイトルを空にしてる
$$('.popup').on('close', function () {
  $$('body').removeClass('with-popup');
  $$(this).find('input[name="title"]').blur().val('');
  $$(this).find('input[name="content"]').blur().val('');
  $$(this).find('input[name="tag"]').blur().val('');
});

// 選択された色に selectedクラスを追加してる（jsの変数で管理とかは特にしてない）
$$('.popup .color').on('click', function () {
  $$('.popup .color.selected').removeClass('selected');
  $$(this).addClass('selected');
  // タグ名の取得
  var color = $$(this).attr("data-color");
  var tagName  = localStorage["tag" + color] || "";
  $$("input.tag").val(tagName);
  $$("input.tag").removeClass("pink");
  $$("input.tag").removeClass("orange");
  $$("input.tag").removeClass("yellow");
  $$("input.tag").removeClass("green");
  $$("input.tag").removeClass("blue");
  $$("input.tag").addClass(color);
});

// タスク登録ボタンを押したときの処理
$$('.popup .add-task').on('click', function () {
  // 入力内容の空白を除去titleに入れる
  var title = $$('.popup input[name="title"]').val().trim();
  // 入力が空なら何もしない
  if (title.length === 0) {
    return;
  }
  // contentを入れる
  var content = $$('.popup input[name="content"]').val();
  if (content.length === 0) {
    return;
  }
  // selectedクラスが付いてる要素のdata-color属性をcolorに追加
  var color = $$('.popup .color.selected').attr('data-color');
  // タグ名の登録
  localStorage["tag" + color] = $$(".tag").val();
  // todoDataという配列にJSONを追加
  todoData.push({
    title: title,
    content: content,
    color: color,
    checked: '',
    id: (new Date()).getTime()
  });
  // todaDataを（新しいのだけじゃなくて一気に全部）文字列に変換してローカルストレージに保存
  localStorage.td7Data = JSON.stringify(todoData);
  // すぐ下で定義されてます。TOPのHTMLを書き換える関数
  buildTodoListHtml("any");
  myApp.closeModal('.popup');
});

// テンプレートを取得。実はscriptタグの中に書いてる。
var todoItemTemplate = $$('#todo-item-template').html();
// TOPのHTMLを書き換える関数
function buildTodoListHtml(color) {
  var html = '';
  for (var i = 0; i < todoData.length; i++) {
    var todoItem = todoData[i];
    // HTML内の{{}}の部分を置き換えてる！！
    if (todoItem.color !== color && color !== "any") {
      continue;
    }
    html += todoItemTemplate
      .replace(/{{title}}/g, todoItem.title)
      .replace(/{{content}}/g, todoItem.content)
      .replace(/{{color}}/g, todoItem.color)
      .replace(/{{checked}}/g, todoItem.checked)
      .replace(/{{id}}/g, todoItem.id);

    $$(".filter." + todoItem.color).css("display", "block");
    $$(".filter." + todoItem.color + " .item-title").text(localStorage["tag" + todoItem.color] || "タグ名なし");
    $$(".filter.any").css("display", "block");
  }
  $$('.todo-items-list ul').html(html);
}
// アプリ起動時に実行
buildTodoListHtml("any");


// Delete item
$$('.todo-items-list').on('delete', '.swipeout', function () {
  var id = $$(this).attr('data-id') * 1;
  var index;
  for (var i = 0; i < todoData.length; i++) {
    if (todoData[i].id === id) index = i;
  }
  if (typeof(index) !== 'undefined') {
    todoData.splice(index, 1);
    localStorage.td7Data = JSON.stringify(todoData);
  }
});

window.addEventListener('load', function (e) {
  // 自分で追加した。FastClick
  FastClick.attach(document.body);

  if (localStorage.first) {
    return;
  }
  init();
}, false);

function init() {
  localStorage.tagblue = "使い方";
  localStorage.tagorange = "英単語";
  var todoData = [];
  todoData.push({
    title: "ここをタップ",
    content: "カードのウラ",
    color: "blue",
    checked: '',
    id: 1
  });
  todoData.push({
    title: "左にスワイプ",
    content: "←",
    color: "blue",
    checked: '',
    id: 2
  });
  todoData.push({
    title: "apple",
    content: "りんご",
    color: "orange",
    checked: '',
    id: 3
  });
  todoData.push({
    title: "orange",
    content: "みかん",
    color: "orange",
    checked: '',
    id: 4
  });
  todoData.push({
    title: "grape",
    content: "ぶどう",
    color: "orange",
    checked: '',
    id: 5
  });
  todoData.push({
    title: "lemon",
    content: "レモン",
    color: "orange",
    checked: '',
    id: 6
  });
  localStorage.first = "true";
  localStorage.td7Data = JSON.stringify(todoData);
  buildTodoListHtml("any");
}
